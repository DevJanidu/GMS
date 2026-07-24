# Attendance integration notes

Branch `phase-3/attendance` (Worktree 2). Backend lives entirely in
`app/Modules/Attendance/**` (Contracts, Controllers, DTOs, Enums, Events,
Middleware, Providers, Requests, Services, Models, `routes.php`, `web.php`).
Frontend lives in `resources/js/modules/attendance/**` and
`resources/js/pages/attendance/**`.

## Critical bug fixed: eligibility date/timezone mismatch

`AttendanceRecorderService::assessEligibility()` computed "today" as an
instant in the tenant's timezone (`CarbonImmutable::now($timezone)`) and
compared it directly against `Membership::$starts_on` /
`Membership::$grace_ends_on`, which are `date`-cast columns parsed in the
app's default timezone (`config('app.timezone')`, i.e. UTC).

For a tenant timezone ahead of UTC (the test fixtures use
`Asia/Colombo`, +5:30), that tenant's local midnight is still the
*previous* UTC evening. So `$today` (an instant) was almost always
earlier than `$membership->starts_on` (UTC midnight of the same calendar
date), and `assessEligibility()` incorrectly treated every membership
that had already started today as not-yet-started — rejecting with
`membership_not_active`. This affected essentially every
eligibility-dependent path, including the basic valid-QR check-in happy
path: 19 of 28 tests were failing before this fix (`membership_not_active`
where a different or no rejection was expected).

Fixed by comparing calendar-date strings (`->toDateString()`) instead of
instants for `starts_on`/`grace_ends_on`, since those columns represent
pure calendar dates with no meaningful time-of-day component. Left
`checked_in_at`/`checked_out_at`/duplicate-window comparisons as instant
comparisons — those are genuine timestamps and correctly timezone-aware
as written. See `AttendanceRecorderService::assessEligibility()` and the
commit message on `598700b` for the full diff.

This was **not** a Membership-module bug — `MembershipAccessChecker::
hasAccess()` only checks `status === Active`, and did that correctly.
The bug was entirely in how Attendance derived "today" for its own
eligibility layering around that contract, per the plan's instruction not
to modify Membership internals.

## Fixes to shared/baseline files

The Phase 3 baseline already contained Attendance's tables/models
(`member_qr_credentials`, `attendance_settings`, `attendance_records`,
`attendance_scan_logs`, `attendance_corrections`) and the migration that
creates them (`2026_07_23_200200_create_attendance_tables.php`). Per plan
section 5.4 these are reusable scaffolding; the following are additive
changes to that existing migration and its models, not a rewrite:

1. **`2026_07_23_200200_create_attendance_tables.php` — removed a
   premature `membership_id` foreign key** on `attendance_records` and
   `attendance_scan_logs`. The Membership module's `memberships` table
   migrates later in the shared migration history
   (`2026_07_23_210001_create_memberships_table.php`), so the original
   `->constrained()` call referenced a table that doesn't exist yet at
   migration time — `php artisan migrate` would fail on a fresh database.
   Changed to `->nullable()->index()` in the baseline migration, and added
   the real FK in a new Attendance-owned follow-up migration
   (`2026_07_23_220200_add_attendance_membership_foreign_keys.php`) that
   runs after `memberships` exists. Verified via a full `php artisan test`
   run against a fresh SQLite database (`RefreshDatabase`).
2. **Models (`AttendanceRecord`, `AttendanceScanLog`, `AttendanceCorrection`,
   `AttendanceSetting`)** — added enum casts (`status`, `source`, `mode`),
   the new fillable idempotency/presence columns (`request_hash`,
   `open_presence_key`), and enforced append-only behavior by throwing
   `LogicException` from `updating`/`deleting` model hooks on
   `AttendanceRecord` (delete only), `AttendanceScanLog`, and
   `AttendanceCorrection` (update + delete). This is the model-layer
   enforcement required by plan section 13 ("Corrections/reversals are
   genuinely append-only... at the model layer").
3. **`MemberQrCredential.php`** shows as modified in `git status` due to a
   line-ending normalization artifact only (`git diff` against it is
   empty) — no real change, nothing committed for this file.

## New additive migrations (Worktree 2 range 200000–299999)

- `2026_07_23_220200_add_attendance_membership_foreign_keys.php` — see
  above.
- `2026_07_23_220201_extend_attendance_idempotency_and_presence.php` —
  adds `request_hash` (sha256 hex, 64 chars) to `attendance_records` and
  `attendance_scan_logs` for idempotent-replay-with-conflict-detection;
  adds a unique `open_presence_key` on `attendance_records` (set only
  while a member is checked in under check-in/check-out mode, cleared on
  checkout/reversal) as the DB-level guard against two concurrent
  check-ins for the same tenant/branch/member; adds `request_id` +
  `request_hash` (unique per tenant) to `attendance_corrections` so
  correction/reversal/checkout mutations are idempotent too.

## Contracts implemented

- `App\Modules\Attendance\Contracts\AttendanceRecorder` — implemented by
  `AttendanceRecorderService`, bound in `AttendanceServiceProvider`.
- `App\Modules\Attendance\Contracts\MemberQrCardProvider` — implemented by
  `MemberQrCredentialService`, bound in `AttendanceServiceProvider`.
- Consumes `App\Modules\Membership\Contracts\MembershipAccessChecker`
  (existing, Membership-owned) — `hasAccess()` is layered with member
  status, membership status/dates, plan/branch access rules, and visit
  limits in `AttendanceRecorderService::assessEligibility()`. Membership
  internals were not modified to make this pass (see bug fix above — the
  bug was on Attendance's side).

## Required integration action: register `AttendanceServiceProvider`

**`AttendanceServiceProvider` is not yet registered in
`bootstrap/providers.php`.** Per plan section 14.2, that file is edited
once by the final integration owner, not by parallel worktrees. Today,
nothing in the codebase actually resolves `AttendanceRecorder` or
`MemberQrCardProvider` through the container — every controller type-hints
the concrete `AttendanceRecorderService`/`MemberQrCredentialService`
classes directly, which Laravel's container can auto-resolve without an
explicit binding (their own constructor dependencies are either concrete
classes or the already-bound `MembershipAccessChecker`). So the module
works correctly as committed, but the contracts aren't wired for any
future consumer that type-hints the interface instead of the concrete
class. Add at integration:

```php
// bootstrap/providers.php
use App\Modules\Attendance\Providers\AttendanceServiceProvider;

return [
    // ...
    AttendanceServiceProvider::class,
];
```

## QR credential design

- `public_id`: a UUID, stored in plaintext (it's not a secret — it's the
  lookup key).
- Token shape: `"{public_id}.{signature}"`, where `signature =
  hash_hmac('sha256', 'gms-attendance|' . public_id, app_key)`. The app
  key never leaves the server; the signature can't be forged without it.
- `token_hash = hash('sha256', token)` is what's stored in
  `member_qr_credentials.token_hash` — the full token is never persisted,
  matching plan section 13 ("stored secret is hashed and never returned").
- `resolveToken()` recomputes the HMAC signature (via `hash_equals`),
  looks up by `public_id`, and separately verifies `hash_equals(stored
  token_hash, hash('sha256', token))` — belt-and-suspenders against both
  a forged signature and a stale/rotated token whose public_id might
  still resolve to a row.
- Rotation issues a brand-new `public_id` (so the QR image itself must be
  regenerated/re-scanned) and marks the previous credential's `revoked_at`;
  revocation just sets `revoked_at` without issuing a replacement.

## Idempotency and concurrency

- **Scans/manual**: `AttendanceScanLog.request_id` is looked up before and
  (after a `Member`-row `lockForUpdate()`) again inside the DB
  transaction; a `UniqueConstraintViolationException` from a genuine race
  is caught and turned into a replay lookup as the final guard. The
  request's fingerprint (`AttendanceCommand::fingerprint()`, sha256 of
  every idempotency-sensitive field, QR token hashed not included in the
  clear) is compared against the stored `request_hash` — a matching
  fingerprint replays the original safe response (`replayed: true`); a
  changed payload under the same `request_id` gets `409
  duplicate_request` instead of silently overwriting.
- **Corrections/checkout/reversal**: same pattern in
  `AttendanceRecordMutationService`, keyed off `attendance_corrections
  .request_id` (unique per tenant) with the same lock-then-recheck
  ordering.
- **Open presence**: the unique `attendance_records.open_presence_key`
  column (set only while checked-in under check-in/check-out mode) is the
  DB-level guard against two concurrent check-ins racing past the
  application-level "already checked in" check.

## Safe rejection reason codes

Exactly the 14 codes in plan section 9.3 —
`member_not_found`, `member_inactive`, `membership_not_found`,
`membership_not_active`, `membership_expired`, `membership_frozen`,
`membership_suspended`, `branch_not_allowed`, `plan_access_denied`,
`visit_limit_reached`, `already_checked_in`, `duplicate_request`,
`invalid_qr`, `rate_limit_exceeded` — defined in
`Enums\AttendanceRejectionReason` with a `message()` match arm each.
Responses never include SQL errors, stack traces, token hashes, or
cross-tenant existence information.

## Domain events

Published (after `DB::afterCommit`, scalar-only payloads — no full
models, no secrets, no free-text override notes beyond the reason code):

- `AttendanceCheckedIn`, `AttendanceCheckedOut` — successful scan/manual/
  checkout.
- `AttendanceRejected` — every rejection path, including rate-limiting
  (dispatched synchronously there since no DB write precedes it).
- `AttendanceOverrideApplied` — in addition to `AttendanceCheckedIn`, when
  a manager override was used.
- `AttendanceCorrected` — corrections, and again (with
  `correctionType: 'reversal'`) alongside `AttendanceReversed` on reversal,
  so a listener that only cares about "history changed" doesn't need to
  know both event names.
- `AttendanceReversed` — reversals.

No listeners are registered by this module — per plan section 7.3/14.5,
notification delivery is Worktree 3's responsibility and must not be
added to Attendance.

## API and route names (plan section 11.3 contract)

All under `auth:sanctum`, `tenant`, `branch` middleware,
`/api/v1/attendance/*`, route names `api.attendance.*`:

| Method/path | Route name | Permission |
| --- | --- | --- |
| `POST /scans` | `api.attendance.scans.store` | `attendance.scan` (+ `attendance.override` if `override: true`) |
| `GET /scans/recent` | `api.attendance.scans.recent` | `attendance.scan` |
| `POST /manual` | `api.attendance.manual.store` | `attendance.manual` (+ `attendance.override`) |
| `GET /members/search` | `api.attendance.members.search` | `attendance.manual` |
| `GET /live` | `api.attendance.live.index` | `attendance.live.view` |
| `GET /records` | `api.attendance.records.index` | `attendance.history.view` |
| `GET /records/{attendanceRecord}` | `api.attendance.records.show` | `attendance.history.view` |
| `POST /records/{attendanceRecord}/checkout` | `api.attendance.records.checkout` | `attendance.scan` |
| `POST /records/{attendanceRecord}/corrections` | `api.attendance.corrections.store` | `attendance.correct` |
| `POST /records/{attendanceRecord}/reversal` | `api.attendance.reversals.store` | `attendance.reverse` |
| `GET /settings` | `api.attendance.settings.show` | `attendance.settings.view` |
| `PUT /settings` | `api.attendance.settings.update` | `attendance.settings.update` |
| `GET /members/{member}/qr` | `api.attendance.qr.show` | `attendance.qr.manage` |
| `POST /qr/rotate` | `api.attendance.qr.rotate` | `attendance.qr.manage` |
| `DELETE /members/{member}/qr` | `api.attendance.qr.revoke` | `attendance.qr.manage` |

`members/search`, `qr.show`, and `qr.revoke` are additive to the plan's
minimum contract (needed by the manual check-in and QR management UI) —
not a deviation from any listed endpoint.

Inertia (`auth`, `verified`, `tenant`, `branch`, `/attendance/*`, route
names `attendance.*`): `scanner`, `manual`, `live`, `history`,
`records.show`, `corrections.create`, `settings`.

## Permission slugs actually used

`attendance.scan`, `attendance.manual`, `attendance.live.view`,
`attendance.history.view`, `attendance.correct`, `attendance.reverse`,
`attendance.override`, `attendance.settings.view`,
`attendance.settings.update`, `attendance.qr.manage` — exactly the ten
slugs proposed in plan section 12.1. **No permission seeder was added** —
this module relies on the existing `attendanceUser()` test helper
creating `Permission` rows via `firstOrCreate` ad hoc, the same way the
Phase 2 Membership/Plan modules bootstrapped their slugs before a shared
seeder existed. The final integration owner should add these ten slugs to
`app/Modules/AccessControl/Support/PermissionCatalog.php` and assign them
to appropriate system roles (e.g. front-desk: scan/manual/live/history;
manager: + correct/reverse/override/settings/qr.manage), per plan section
12.1's closing note.

## Settings and mode behavior

`AttendanceSettingsService::forBranch()` lazily creates a per-branch
`AttendanceSetting` row (unique on `branch_id`) with safe defaults
(`check_in_only`, 60s duplicate window, manual entry allowed, override
required). Two attendance modes:

- **`check_in_only`** (default): every scan/manual action creates a new
  `checked_in` record; a second scan inside `duplicate_window_seconds`
  returns `already_checked_in`; explicit checkout is rejected
  (`Check-out is disabled for this branch.`).
- **`check_in_out`**: a scan while a record is open (`checked_in`, no
  `checked_out_at`) either checks out (action `auto`/`check_out`) or is
  rejected as `already_checked_in` if another scan lands inside the
  duplicate window; `POST .../checkout` is also available as an explicit
  staff-initiated action from the history/detail view.

Visit limits (`visits_per_day|week|month`, checked from the plan's
`plan_access_rules_snapshot` first, then the branch setting's
`visit_limit_rules`) and branch/plan access rules
(`allowed_branch_ids`, `gym_access`, and `Plan::isAvailableAtBranch()`)
are layered in `assessEligibility()` after the base membership-status
checks.

## Sidebar entries required (for Worktree 1 to wire, not touched here)

```text
Operations
└── Attendance
    ├── QR Scanner        -> attendance.scanner        (Camera icon)      attendance.scan
    ├── Manual Check-in   -> attendance.manual          (UserCheck icon)  attendance.manual
    ├── Live Attendance   -> attendance.live            (Users icon)      attendance.live.view
    ├── Attendance History-> attendance.history         (History icon)    attendance.history.view
    └── Attendance Settings -> attendance.settings      (Settings icon)   attendance.settings.view
```

(Corrections are reached from a history/detail row action, not a
top-level nav entry — matches the plan's one-parent/one-child-level
navigation constraint.)

## Known limitations / things worth revisiting

- No dedicated Attendance permission seeder exists yet (see "Permission
  slugs" above) — this is the same gap Phase 2 Membership/Plan had before
  a shared seeder existed, not a regression introduced here.
- `AttendanceServiceProvider` isn't registered (see "Required integration
  action" above) — currently harmless (nothing resolves the interfaces
  through the container yet) but should be wired before any other module
  is written to depend on `AttendanceRecorder`/`MemberQrCardProvider`
  rather than the concrete Attendance services.
- `resources/js/actions/App/Modules/Attendance/**` and
  `resources/js/routes/{api/,}attendance/**` are Wayfinder-generated;
  running `npm run build`/`wayfinder:generate` regenerates *every*
  module's generated output, not just Attendance's (same behavior the
  Phase 2 Billing worktree documented in the repo-root
  `INTEGRATION_NOTES.md`). Those unrelated regenerated files (~65, all
  pure `@see` docblock path noise from the `vendor-shared/` symlink
  farm — see below) were reverted before committing so this branch's
  diff stays scoped to Attendance.
- `vendor-shared/` (worktree root) is a symlink farm: `vendor/<package>`
  in this worktree symlinks into `vendor-shared/<package>`, which itself
  symlinks back to the main `GMSv1` checkout's `vendor/`, avoiding a full
  duplicate composer install per Phase 3 worktree. It is legitimate
  infrastructure, not a stray artifact — do not delete it. It was missing
  from `.gitignore` (only `/vendor/` was covered); added `/vendor-shared/`
  to `.gitignore` in this branch. Its one real side effect: PHPStan's
  phar self-bootstrap resolves `__DIR__` through the symlink to the
  *physical* file in `GMSv1`, which then re-requires `GMSv1`'s
  `vendor/autoload.php` on top of this worktree's already-loaded
  autoloader, fataling with "Cannot redeclare class
  ComposerAutoloaderInit...". This reproduces on `vendor/bin/phpstan
  --version` alone (no files analyzed), for any module, so it is not an
  Attendance-code issue — see "Test results" in the handoff.

## Verification

`php artisan test tests/Feature/Attendance tests/Unit/Attendance` (29
tests), full `php artisan test` (222 tests), `npm run test` (42 tests,
includes 3 Attendance test files), `npm run lint:check`, `npm run
types:check`, and `npm run build` all pass. See the structured handoff
(`PHASE3_HANDOFF.md`) for the exact PASS/FAIL status of every section 16
command.
