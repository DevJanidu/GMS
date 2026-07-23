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

# Phase 2 Worktree 3 — Billing integration requirements

The Phase 2 baseline does not contain the published shared contracts or shared
domain events listed in `SRS.md`. This branch intentionally does not add
competing definitions under `app/Shared/**`. Billing internals use integer
minor units and expose narrow services that can be adapted when the canonical
DTOs and method signatures are merged.

## Exact contract bindings required during integration

Add adapters in the integration merge after the real shared interfaces/DTOs
exist, then register these bindings in the shared application provider:

```php
$this->app->bind(
    \App\Shared\Contracts\InvoiceCreator::class,
    \App\Modules\Billing\Integration\SharedInvoiceCreatorAdapter::class,
);
$this->app->bind(
    \App\Shared\Contracts\PaymentRecorder::class,
    \App\Modules\Billing\Integration\SharedPaymentRecorderAdapter::class,
);
$this->app->bind(
    \App\Shared\Contracts\ReceiptGenerator::class,
    \App\Modules\Billing\Integration\SharedReceiptGeneratorAdapter::class,
);
```

The adapters must delegate without duplicating financial logic:

- `SharedInvoiceCreatorAdapter` maps the canonical membership invoice DTO to
  `InvoiceCreatorService::create()`. Required values are `branch_id`,
  `member_id`, optional `membership_id`, ISO currency, item descriptions,
  quantities and unit prices converted to cents, discount type/value (fixed
  cents or percentage basis points), tax basis points, joining-fee cents,
  optional dates/notes, caller ID, and an idempotency key. Return the invoice
  ID/public ID/number, grand-total cents, paid cents, and balance cents in the
  canonical result DTO.
- `SharedPaymentRecorderAdapter` maps the canonical payment DTO to
  `PaymentRecorderService::record(Invoice $invoice, array $data)`. It must pass
  amount cents, one of `cash|card|bank_transfer|online`, reference, metadata,
  paid-at time, actor ID, and the caller's idempotency key. Return the immutable
  payment and generated receipt identifiers in the canonical result DTO.
- `SharedReceiptGeneratorAdapter` resolves the immutable payment and delegates
  to `ReceiptGeneratorService::generate()`. Receipt generation is already
  idempotent through the unique `payment_id`.

Do not make Billing depend on Membership models. `membership_id` is an opaque,
nullable published identifier and deliberately has no foreign key until the
integration merge can confirm the canonical membership table/key.

## Exact shared event bridge required

Billing writes a transactional outbox row and dispatches
`App\Modules\Billing\Events\BillingEventPublished` only after commit. Add one
integration listener which maps these event types to the canonical shared
events, preserving `eventId` as the downstream idempotency key:

- `InvoiceCreated` → shared `InvoiceCreated`
- `PaymentCompleted` → shared `PaymentCompleted`
- `PaymentRefunded` → shared `PaymentRefunded`

`InvoiceVoided` remains a billing-specific outbox event unless a canonical
shared equivalent is added. The listener must not dispatch membership events
or modify membership records.

## Required foundation/shell wiring

These shared-file edits were not made because they belong to other worktrees:

1. `bootstrap/app.php` currently omits `api: __DIR__.'/../routes/api.php'` from
   `withRouting(...)`. Add it so the existing module API auto-loader discovers
   `app/Modules/Billing/routes.php`.
2. Run `App\Modules\Billing\Database\Seeders\BillingPermissionSeeder` from the
   shared `DatabaseSeeder`, and add its ten slugs to the shared permission
   catalogue/matrix. The exact slugs are the `PERMISSIONS` keys in that seeder.
3. The current Inertia shell has no module route auto-loader. Load
   `resources/js/modules/billing/routes.tsx` in the shell router and
   `resources/js/modules/billing/navigation.ts` in the permission-aware
   navigation loader. Route parameters must be passed to page components as
   numeric `invoiceId`/`receiptId`; create-invoice must receive the active
   numeric `branchId`.
4. Preserve the `tenant` and `branch` middleware on every billing API route and
   send the shell's active branch as `X-Branch-Id`.
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
# Integration Notes — Worktree 2 (Memberships, Renewals and Expiry)

Branch `phase-2/membership-lifecycle`. Backend lives entirely in
`app/Modules/Membership/**` (Controllers, Models, Policies, Requests,
Resources, Services, Actions, Queries, Events, Console, Contracts,
Testing, Providers), matching the per-module structure in SRS B.3 and the
precedent already set by the Phase 1 `app/Modules/{Staff,Branch,Gym,
AccessControl}` modules. Frontend lives in `resources/js/modules/
{memberships,renewals}/**` and `resources/js/pages/{memberships,renewals}/**`
(this repo's actual equivalent of the SRS's `frontend/src/modules/**` —
see Worktree 3's note above: the foundation shipped Inertia + `resources/js`,
not a standalone `frontend/` SPA).

## Fixes to shared/foundation files

1. **`bootstrap/app.php` — `routes/api.php` was never wired up.**
   `routes/api.php` already contained the glob-loader for every module's
   `routes.php` (`glob(app_path('Modules/*/routes.php'))` under an `/v1`
   prefix), but `withRouting()` never passed `api: routes/api.php` to
   Laravel, so the file was never loaded at all. Every existing
   `app/Modules/*` JSON API (Staff, Branch, Gym, AccessControl) was
   completely unreachable — `BranchApiSmokeTest` and all of
   `RoleCrudTest`/`StaffCrudTest`'s API assertions were failing with 404
   before this fix (65/118 tests passing repo-wide). Added
   `api: __DIR__.'/../routes/api.php'` to the `withRouting()` call. This
   is a one-line foundation fix needed for *any* module using the
   `app/Modules/*/routes.php` convention, not just Membership — after the
   fix, 101/118 tests passed (remaining failures were an unrelated missing
   Vite manifest, fixed by running `npm install && npm run build`).
2. **`routes/web.php`** — added one `require app_path('Modules/Membership/
   web.php');` line, following the exact pattern Member/Plan already use
   (`require __DIR__.'/../routes/members.php'` etc.). No module web-route
   auto-loader exists yet (SRS B.2 "module route auto-loading" was never
   built for web routes, only for the `/v1` JSON API glob in
   `routes/api.php`) — each new module still needs one manual `require`
   line here, same gap Worktree 3 already flagged.
3. **`tests/Pest.php`** — `pest()->extend(TestCase::class)->in('Feature')`
   only bound Laravel's `TestCase` (and therefore `config()`/`app()`
   helpers) for Pest closure tests under `tests/Feature`. Any Pest-style
   Unit test (`tests/Unit/**`) ran as a bare PHPUnit case with no
   framework bootstrap. Changed to `->in('Feature', 'Unit')` so
   `tests/Unit/Membership/**` (and any future module's Pest-style unit
   tests) can use `config()`, `app()`, etc.
4. **`app/Providers/AuthorizationServiceProvider.php`** — added
   `Membership::class => MembershipPolicy::class` to the `$policies` array,
   following the exact precedent Branch/Role/Staff already established
   there (module-namespaced models aren't found by Laravel's
   convention-based policy discovery, so they're registered explicitly).
5. **`bootstrap/providers.php`** — added `MembershipServiceProvider::class`.
   No other `app/Modules/*` module had its own service provider before
   this (Staff/Branch/Gym/AccessControl only touch `AuthorizationServiceProvider`
   for Gate registration); Membership needed one to register its daily
   expiry console command and bind its contracts, so this establishes the
   pattern for modules that need bindings beyond authorization.
6. **`routes/console.php`** — added
   `Schedule::command('membership:process-expiry')->dailyAt('00:30');`
   (the SRS-required daily expiry scheduler). Whoever owns the production
   deploy still needs `php artisan schedule:work` (or the server cron
   entry calling `schedule:run` every minute) actually running — that's
   infra, not app code.
7. **`database/seeders/DatabaseSeeder.php`** — added
   `memberships.{view,sell,renew,freeze,suspend,cancel,reactivate}`
   permission rows, same additive pattern Member/Plan already used. The
   seeded "owner" role bypasses all Gate checks regardless.

## Migrations (range 210001–210002, well inside the assigned 200000–299999)

- `memberships` — owned by Membership per SRS Rule 7. Stores the plan/price
  snapshot at time of sale (`plan_*_snapshot` columns) so later Plan edits
  never rewrite what a member actually bought, plus lifecycle fields
  (`status`, `grace_ends_on`, freeze/suspend/cancel timestamps,
  `previous_membership_id` for the renewal chain). `invoice_id` is a plain
  `unsignedBigInteger` with **no foreign key** — Billing owns `invoices`
  and may not exist in this database at all during Membership's own test
  runs, so this is intentionally decoupled (see InvoiceCreator below).
- `membership_events` — append-only history table. Both `Membership` and
  `MembershipEvent` throw `RuntimeException` from a `deleting` (and, for
  events, `updating`) model hook, so "no destructive historical deletion"
  is enforced at the model layer, not just by omission of a destroy route.

## Shared contracts named in SRS B.5 — none existed in this baseline yet

The SRS says `MembershipPriceCalculator`, `MembershipDateCalculator`,
`InvoiceCreator`, `PaymentRecorder`, `MembershipAccessChecker`,
`ReceiptGenerator`, `MembershipRenewalContract` should be committed to
`develop` *before* Phase 2 parallel work starts. None of them exist in this
repo — Worktree 1 (`phase-2/dashboard-integration`) and Worktree 3
(`phase-2/billing-payments`) are presumably adding their own halves in
parallel. Per this task's instructions, I did not invent a competing
`App\Shared\Contracts\*` namespace that another worktree might also
independently create with a different shape. Instead every contract is
module-local under `App\Modules\Membership\Contracts\*`:

| Contract | Where | Real owner at integration |
|---|---|---|
| `MembershipDateCalculator` | `Contracts/MembershipDateCalculator.php`, impl in `Services/MembershipDateCalculatorService.php` | Membership (this module owns it permanently — no action needed) |
| `MembershipPriceCalculator` | same pattern | Membership (owns permanently) |
| `MembershipAccessChecker` | `Contracts/MembershipAccessChecker.php`, impl `Services/MembershipAccessCheckerService.php` | Membership owns the implementation; **Phase 3's Attendance module will need to depend on this interface** (SRS B.6) — promote the *interface* (not the implementation) to `App\Shared\Contracts\MembershipAccessChecker` when Attendance's worktree starts, and re-point this module's `use` statement at the shared copy. |
| `InvoiceCreator` | `Contracts/InvoiceCreator.php`; signature is exactly `createForMembership(MembershipInvoiceData $data): InvoiceResult` per SRS B.5 | **Billing** binds its real implementation. Until then, `App\Modules\Membership\Testing\FakeInvoiceCreator` is bound in `MembershipServiceProvider::register()` and fabricates a deterministic `InvoiceResult` (sequential fake IDs starting at 900000) — it never writes to a real `invoices` table. |
| `PaymentRecorder` | `Contracts/PaymentRecorder.php` | **Billing** binds the real implementation; `Testing\FakePaymentRecorder` is the interim binding (same pattern as above). |
| `ReceiptGenerator` | `Contracts/ReceiptGenerator.php` | **Billing** binds the real implementation; `Testing\FakeReceiptGenerator` is the interim binding. |
| `MembershipRenewalContract` | Not implemented as a separate interface — `RenewMembershipAction::execute()` is the concrete renewal entry point. If another module (e.g. a future admin/reporting tool) needs to trigger a renewal without depending on this module's Action class directly, extract its signature into `Contracts\MembershipRenewalContract` at that point. |

**At the Phase 2 integration merge**, swap the three bindings in
`App\Modules\Membership\Providers\MembershipServiceProvider::register()`:

```php
$this->app->bind(InvoiceCreator::class, FakeInvoiceCreator::class);   // -> Billing\...\InvoiceCreator
$this->app->bind(PaymentRecorder::class, FakePaymentRecorder::class); // -> Billing\...\PaymentRecorder
$this->app->bind(ReceiptGenerator::class, FakeReceiptGenerator::class); // -> Billing\...\ReceiptGenerator
```

The full 10-step sale transaction from SRS B.5 (validate member → validate
plan → calculate dates → create membership → invoice → optional payment →
receipt → activate → commit → publish events after commit) is implemented
in `Actions/SellMembershipAction.php` and `Actions/RenewMembershipAction.php`,
both using `DB::transaction()` + `DB::afterCommit()` for event publishing.
Membership never creates an invoice/payment/receipt row itself anywhere in
the codebase — grep for `Contracts\InvoiceCreator`/`PaymentRecorder`/
`ReceiptGenerator` usage to confirm before wiring the real bindings.

## Domain events published (SRS B.5 list)

`MembershipCreated`, `MembershipActivated`, `MembershipRenewed`,
`MembershipFrozen`, `MembershipSuspended`, `MembershipCancelled`,
`MembershipExpiring`, `MembershipExpired` — all under
`App\Modules\Membership\Events\*`, dispatched via Laravel's normal event
system (`Event::class::dispatch(...)`) after each action's DB transaction
commits. There is no `MembershipReactivated` event — SRS B.5 doesn't list
one, so reactivation re-dispatches `MembershipActivated` (the membership's
resulting state is "active" either way; a listener that only cares about
"this membership just became usable again" doesn't need a separate event
name). Phase 3's Notification module should listen to these by
fully-qualified class name in its own `EventServiceProvider` — Membership
will never modify a notification/report controller directly (SRS Rule 6).

## Business rules a Billing/Attendance/Notification implementer should know

- **Grace period keeps `status = 'active'`.** A membership past
  `expires_on` but still `<= grace_ends_on` is *not* a separate status —
  `Membership::isInGracePeriod()` / `MembershipResource.in_grace_period`
  is how callers detect it. `MembershipAccessCheckerService::hasAccess()`
  currently returns `true` for any `active` membership regardless of
  grace — Attendance's real access check (Phase 3) should decide whether
  grace-period members get building access or just an admin-visible flag.
- **Freeze extends `expires_on`/`grace_ends_on` by the paused day count;
  Suspension does not.** This was a deliberate choice (freeze = member
  benefit preserved, suspension = staff-imposed block, typically for
  non-payment/discipline) — see the doc comments on `SuspendMembershipAction`
  and `ResumeMembershipAction`. If Billing's non-payment workflow expects
  suspension to *also* pause the clock, that's a one-line change in
  `SuspendMembershipAction`/`ReactivateMembershipAction`, not a schema
  change.
- **Only `Frozen`/`Suspended` memberships are eligible for reactivation**
  (`MembershipStatus::isEligibleForReactivation()`). `Cancelled` and
  `Expired` are terminal by design — sell a new membership or renew
  instead. This matches the SRS wording "reactivate *eligible*
  memberships" rather than treating every non-active membership as
  reactivatable.
- **Early renewal never loses paid days.** `RenewMembershipAction` always
  computes the new membership's `starts_on` itself
  (`current->expires_on->addDay()` if the current membership hasn't
  expired yet, else today) — it never accepts a caller-supplied start
  date, specifically so this guarantee can't be violated by a bad request.
- **The daily expiry scheduler excludes `Frozen` memberships** from the
  expired-detection sweep (their clock is intentionally paused) but does
  include `Suspended` ones (their clock keeps running, per the point
  above). `Active` memberships already flagged `expiring_notified_at` are
  never re-flagged, and any membership with a forward `previous_membership_id`
  link (i.e. already renewed) is excluded from "expiring soon" detection.

## Known gaps / things Worktree 1 or Worktree 3 (Billing) may want to revisit

- `bootstrap/providers.php` and `AuthorizationServiceProvider` now have a
  precedent for module-registered providers/policies — Billing's worktree
  should follow the same pattern (a `BillingServiceProvider` for its own
  bindings) rather than growing `AppServiceProvider`.
- The Fake `InvoiceCreator`/`PaymentRecorder`/`ReceiptGenerator` bindings in
  `MembershipServiceProvider` are a real, working seam (used by this
  module's own Pest tests today) — Billing's worktree can bind its real
  implementations without touching any Membership code, per the table
  above.
- Wayfinder (the Laravel/Inertia route-to-TS-action generator) regenerates
  *every* module's generated files under `resources/js/actions/**` and
  `resources/js/routes/**` whenever `npm run build`/`wayfinder:generate`
  runs, not just the module that changed — this repo commits those
  generated files to source control, so every worktree that adds a route
  and rebuilds will see cosmetic diffs across other modules' generated
  files (e.g. narrower TS union types on `{member}`/`{plan}` route params).
  These were reverted here before committing since they're pure
  regeneration noise with no logic change — expect the same thing to
  happen to Billing's/Attendance's generated files once this branch merges
  and someone rebuilds.
