# Integration Notes — Worktree 3 (Member and Membership Plan CRUD)

Changes made outside `app/Modules/Member/**`, `app/Modules/Plan/**`-equivalent
ownership (this repo doesn't use the `app/Modules/*` structure the SRS
describes — the foundation commit put shared code in flat `app/*` namespaces
instead, so Member/Plan code follows that same convention: `app/Models`,
`app/Http/Controllers`, `app/Policies`, `app/Services`).

## Fixes to shared/foundation files

1. **`bootstrap/app.php` — cross-tenant data leak via route model binding.**
   `SubstituteBindings` was running *before* the `tenant` middleware in the
   actual execution order (custom middleware aliases aren't in Laravel's
   middleware priority list, so they don't get sorted relative to it). That
   meant `Route::get('/members/{member}', ...)` could resolve `$member` by ID
   alone, before `TenantScope` was bound to the request — a member (or any
   tenant-scoped model) from another tenant would resolve and render instead
   of 404ing. Fixed by adding `IdentifyTenant` and `SetBranchContext` to the
   middleware priority list via `prependToPriorityList(before:
   SubstituteBindings::class, ...)`. This affects every tenant-scoped model
   bound via route parameters (Branch, Staff, etc.), not just Member/Plan —
   worth a regression test in Worktree 2's suite too.
2. **`app/Http/Controllers/Controller.php`** — added the
   `AuthorizesRequests` trait (was a bare empty class). `$this->authorize()`
   doesn't exist without it; every controller needing policy checks needs
   this regardless of module.
3. **`database/seeders/DatabaseSeeder.php`** — the seeded demo user had no
   role, so every `Gate`/policy check failed for it. Added an `owner`
   system role (bypasses all checks per `AuthorizationServiceProvider`)
   attached to the seeded user, plus baseline `members.*`/`plans.*`
   permission rows. Full role/permission CRUD and seeding is Worktree 2's
   responsibility — these rows just keep the demo account usable until that
   lands; feel free to replace/expand.
4. **`resources/js/components/app-sidebar.tsx`** — hardcoded nav items for
   Members and Plans (`mainNavItems`), since permission-aware, auto-loaded
   module navigation (SRS Rule 4) isn't built yet. Marked with a `TODO(ui-shell)`
   comment. Each module also exports `resources/js/modules/{members,plans}/navigation.ts`
   in the shape Rule 4 describes, so swapping in real auto-loading later should
   just mean importing from there instead of hand-wiring the sidebar.
5. **`routes/web.php`** — added two `require` lines for `routes/members.php`
   and `routes/plans.php`, following the existing `routes/settings.php`
   pattern. No module route auto-loading exists yet (SRS/B.2 foundation
   item); each new module currently needs one more `require` line here.

## New shared-ish frontend primitives (not business logic, added as needed)

- `resources/js/components/ui/{table,textarea,tabs,switch}.tsx` — shadcn
  primitives that didn't exist yet (added via hand-written equivalents,
  `npx shadcn add` couldn't run in this environment — no `pnpm`/network
  issues with the CLI's install step). Installed `@radix-ui/react-tabs` and
  `@radix-ui/react-switch` as new npm deps.
- `resources/js/components/pagination-links.tsx` — generic pagination
  control consuming Laravel's default paginator `meta.links` shape. Used by
  both `members/index` and `plans/index`.
- `resources/js/types/pagination.ts` — generic `Paginated<T>` type matching
  Laravel's `JsonResource::collection()` output for a paginator (`data`,
  `links`, `meta`). This is the "shared pagination format" the foundation
  was supposed to define (B.2) but didn't; exported from `types/index.ts`.

## New tables (owned by Member/Plan modules per Rule 7)

- `members`, `member_sequences`, `member_documents` (Member module)
- `plans`, `plan_branch`, `plan_price_histories` (Plan module)

`member_sequences` backs tenant-scoped, gap-free member-number generation
(one row per tenant, row-locked on issue). `plan_price_histories` is an
append-only ledger of every price a plan has ever had (via a `PlanObserver`
on `saved`), so Phase 2 billing can resolve the price that applied on a
membership's start date even after the plan's current price changes.

## Known gaps / things Worktree 2 or the ui-shell may want to revisit

- The `dashboard` route in `routes/web.php` still isn't wrapped in
  `tenant`/`branch` middleware. Not touched here since dashboard business
  logic belongs to Worktree 1, but any tenant-scoped query it adds later
  will silently return cross-tenant data without it.
- Member/Plan permission rows (`members.view`, `plans.create`, etc.) were
  added ad hoc in the seeder. Worktree 2's role/permission management UI
  should treat these as the canonical slugs for this module rather than
  inventing new ones.

---

# Integration Notes — Worktree 1 (Phase 2: Live Dashboard and Shared Workflow Components)

## Missing Phase 2 shared contracts (blocking real financial/membership data)

Per SRS B.5, Phase 2 was supposed to start with `MembershipDateCalculator`,
`InvoiceCreator`, `PaymentRecorder`, `MembershipAccessChecker`,
`ReceiptGenerator`, `MembershipRenewalContract` and the membership/billing
domain events already committed to `develop`. **None of that exists in this
baseline** — there are no `memberships`, `invoices`, or `payments` tables,
no Membership/Billing modules, and no events to listen to.

The dashboard SRS requirements that depend on that data — expiring/expired
membership counts, revenue, outstanding balances, recent payments, and the
renewal summary — cannot be implemented against real data without either
(a) inventing a shadow schema that would conflict with Worktree 2/3's
eventual tables, or (b) reaching into their modules directly, which the
brief explicitly forbids ("must not implement membership or billing
business logic").

Instead, `app/Modules/Dashboard/Services/DashboardMetricsService.php`
returns those sections with a `status: 'pending_integration'` discriminant
(distinct from `status: 'restricted'`, used when the *viewer* lacks
permission) and a human-readable message, rather than fabricated numbers.
The frontend (`resources/js/modules/dashboard/components/section-boundary.tsx`)
renders a visibly different empty state for each. Sections backed by data
this worktree already owns — active/new member counts, branch comparison
(active members only), and a "new member" activity feed — are real,
tenant- and branch-scoped queries against `Member`/`Branch`.

**Action needed at Phase 2 integration merge:** once `phase-2/membership-lifecycle`
and `phase-2/billing-payments` land, wire the six pending sections in
`DashboardMetricsService::summary()` to real queries (ideally via a
`ReportQuery`-style read contract analogous to the one already planned for
Phase 3, rather than Dashboard querying Membership/Billing tables
directly). The JSON shape (`DashboardSection<T>` in
`resources/js/modules/dashboard/types/index.ts`) is designed so swapping
`pending_integration` for `available` in one service method is the only
frontend-visible change required — no page/component changes needed.

## Fixes to shared/foundation files

1. **`bootstrap/app.php` — `routes/api.php` was never registered.**
   `withRouting()` only declared `web`, `commands`, and `health` — there was
   no `api:` entry at all. Every module's `/api/v1/*` endpoint (Branch,
   Staff, AccessControl, and now Dashboard) 404s on a genuinely fresh
   checkout with no stale route cache to mask it; the entire existing
   `RoleCrudTest`/`BranchCrudTest`/etc. suite was failing for this reason
   before this fix, not because of anything in this worktree. Fixed by
   adding `api: __DIR__.'/../routes/api.php'` to `withRouting()`, which
   applies Laravel's default `api` middleware group + `/api` prefix and
   combines with `routes/api.php`'s own `Route::prefix('v1')` to produce
   the `/api/v1/...` paths every module (and the frontend `apiClient`)
   already assumed existed. Confirmed via `php artisan route:list` and a
   full `php artisan test` run (131 passing after the fix, ~18 failing
   with 404s before it).
2. **`bootstrap/app.php` — the `api` middleware group had no Sanctum SPA
   support.** Registering `routes/api.php` (previous item) got routes
   resolving, but every request still 401'd for a real logged-in browser
   session — confirmed manually: `/dashboard` (an Inertia web route)
   correctly showed the authenticated user, but `/api/v1/dashboard/summary`
   401'd for that same browser session. `auth:sanctum` only accepts a
   session cookie as valid credentials for requests Sanctum's
   `EnsureFrontendRequestsAreStateful` middleware processes; without it in
   the pipeline, the guard only ever accepts a bearer token, which the
   frontend's cookie-based `apiClient` (`resources/js/lib/api/client.ts`)
   never sends. Fixed by adding `$middleware->statefulApi();` — this
   affects every module's API, not just Dashboard's; every existing
   `actingAs(...)->getJson(...)` feature test passed both before and after
   this fix because `actingAs()` bypasses the HTTP/middleware layer
   entirely, so the test suite alone could not have caught it. Added
   `tests/Feature/Dashboard/SessionAuthSmokeTest.php`, which logs in via a
   real `POST /login` and then calls the API in the same test-client
   session (no `actingAs()`), to catch a regression here in the future.
3. **`app/Http/Middleware/HandleInertiaRequests.php` — `auth.user.permissions`
   was never populated.** The shared prop passed the raw `$request->user()`
   model, which has no `permissions` attribute; the frontend's `can()`
   helper (`resources/js/lib/permissions/can.ts`) special-cased a missing
   array as "allow everything", so permission-aware navigation and the new
   `PermissionGate`/`ProtectedRoute` usage on the dashboard were checking
   against a permission set that never actually reflected the signed-in
   user's roles for anyone who wasn't the seeded owner. Fixed by adding
   `User::permissionSlugs()` (in `HasRolesAndPermissions`, returns `['*']`
   for the `owner` role, otherwise the union of the user's roles'
   permission slugs) and attaching it explicitly in `share()`. Also changed
   `can()` to fail closed (deny) rather than allow-all when `permissions`
   is unexpectedly absent, and extended it to accept `string[]`
   (any-of-match) since dashboard widgets can be gated by more than one
   acceptable permission.
4. **`app/Modules/AccessControl/Support/PermissionCatalog.php` /
   `database/seeders/RoleSeeder.php`** — added a `Dashboard` permission
   group (`dashboard.view`, `dashboard.financials.view`) and assigned it to
   the `manager` (both) and `front-desk` (view only, no financials) system
   roles, following the existing pattern for other modules' permissions.
   AccessControl isn't owned by any Phase 2 worktree, and the dashboard
   can't do permission-restricted widgets without permission slugs to
   check. Note `RoleSeeder`/`PermissionSeeder` aren't currently called from
   `DatabaseSeeder` (pre-existing gap, not introduced here) — the seeded
   demo `owner` account bypasses every check regardless, so this wasn't
   blocking, but a real non-owner role won't have these permissions until
   Worktree 2's role/permission UI (or `DatabaseSeeder`) actually assigns
   them.

## New Dashboard module (owned by this worktree, no conflicts)

`app/Modules/Dashboard/{Controllers,Services,Requests}` + `routes.php`,
auto-loaded by the existing `app_path('Modules/*/routes.php')` glob in
`routes/api.php` — no changes needed there. Exposes:

- `GET /api/v1/dashboard/summary` — accepts `branch_id`, `date_from`,
  `date_to`. Branch scoping: owners see all tenant branches; everyone else
  is limited to branches in `user_branch`, and an explicit `branch_id`
  outside that set 403s. Intentionally does **not** use the `branch`
  middleware (`SetBranchContext`) — that middleware resolves a single
  "acting branch" (primary, or explicit) for write flows, whereas a
  read-only dashboard with "all branches I can see" as its default needs
  different semantics.
- `GET /api/v1/dashboard/filters` — branch options for the branch filter,
  scoped the same way.

## New shared frontend primitives

- `resources/js/components/ui/popover.tsx` — shadcn primitive that didn't
  exist yet, needed for the date-range picker. Added
  `@radix-ui/react-popover` as a new npm dependency (same precedent as
  Worktree 3 adding `@radix-ui/react-tabs`/`react-switch`).
- `resources/js/components/shared/{date-range-picker,currency-display,
  money-input,branch-filter,activity-timeline,details-page-layout}.tsx` —
  new shared components per the Phase 2 "shared components" list.
  `data-table.tsx`, `status-badge.tsx`, and `permission-gate.tsx`/
  `protected-route.tsx` were extended (loading/error states + row links;
  status-string tone inference; multi-permission support) rather than
  replaced — existing usages in `members`/`plans` pages are unaffected
  (verified: none of them import the shared `StatusBadge`, they use their
  own `MemberStatusBadge`/`PlanStatusBadge`).
- Added `vitest` + `@testing-library/react`/`jest-dom` + `jsdom` as
  devDependencies and `npm run test` script — no frontend test runner
  existed before this worktree.

## Verification

`npm run lint:check`, `npm run types:check`, `npm run test` (37 tests),
`npm run build`, and `composer test`-equivalent (`pint --test`, `phpstan
analyse`, `php artisan test`, 131 tests) all pass. `pint --test` reports a
`line_ending` fixer on effectively every file in the repo — that's the
Windows checkout's CRLF vs Pint's expected LF, pre-existing and unrelated
to this worktree (confirmed: files created fresh in this worktree don't
show up in that list, only files already checked out before this session
started do). Deliberately did not run `pint --write` repo-wide, per Rule 9.
