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
