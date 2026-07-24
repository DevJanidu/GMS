# Phase 3 Structured Handoffs

## Worktree 2: Attendance (Claude Work)

Agent: Claude Work

Worktree: ../gms-p3-claude-work

Branch: phase-3/attendance

Summary:
Reviewed and completed the Attendance module (secure QR check-in/out,
manual attendance, eligibility checks, manager override, correction/
reversal, live present list, branch settings, rate limiting) that a prior
session had implemented but never committed. Found and fixed one critical
bug — an eligibility-check timezone/date mismatch that rejected almost
every valid check-in (19/28 tests failing) — reviewed every changed/new
file, added one missing test (event-dispatch-only-after-commit), ran the
full validation suite, and committed everything in 9 logical commits.
All 222 backend tests and 42 frontend tests pass; production build
succeeds.

Completed features:
- Secure, non-guessable member QR credentials: UUID public_id + HMAC-SHA256
  signature (server key never leaves the server), sha256 hash stored at
  rest, issue/rotate/revoke, never returns the stored hash.
- QR scan (phone camera / pasted token) and manual attendance (member
  search + check-in) with tenant/branch context derived from
  authenticated request only.
- Full eligibility pipeline: member status, membership existence/status
  (active/pending/expired/frozen/suspended), start-date gating, plan
  gym-access flag, allowed-branch list, plan branch availability,
  per-day/week/month visit limits.
- Duplicate-scan window and check-in-only vs. check-in/check-out modes,
  with explicit checkout endpoint.
- Manager override: requires a distinct permission and a mandatory
  reason, only for overridable rejection reasons, writes an audit record.
- Append-only correction and reversal, both idempotent and row-locked,
  with before/after snapshots and audit records; enforced at the model
  layer (throws on update/delete of scan logs/corrections, delete of
  records).
- Live present-member query and count, bounded paginated history, recent
  scan results scoped to the acting staff/device.
- Per-branch attendance settings (mode, duplicate window, manual-entry
  toggle, override-required toggle, visit-limit rules), validated and
  audited on update.
- Idempotency end-to-end: request_id + request_hash fingerprinting with
  replay-on-match / 409-on-changed-payload, DB-level unique constraints
  as the final guard (attendance_scan_logs.request_id,
  attendance_corrections (tenant_id, request_id),
  attendance_records.open_presence_key).
- Scan rate limiting keyed by tenant+branch+staff+device+IP, safe
  rate_limit_exceeded reason, Retry-After header.
- Domain events published only after DB commit, scalar-only payloads (no
  full models, no secrets).
- Mobile QR scanner (native BarcodeDetector API, no new dependency) with
  camera permission/unsupported/denied states and manual-paste fallback;
  manual check-in, live attendance, history, record details, correction,
  and settings pages; manager-override dialog.

Files changed:
- app/Modules/Attendance/Contracts/{AttendanceRecorder,MemberQrCardProvider}.php (new)
- app/Modules/Attendance/DTOs/{AttendanceCommand,AttendanceResult,QrCardData}.php (new)
- app/Modules/Attendance/Enums/{AttendanceMode,AttendanceRejectionReason,AttendanceSource,AttendanceStatus}.php (new)
- app/Modules/Attendance/Events/{AttendanceCheckedIn,AttendanceCheckedOut,AttendanceCorrected,AttendanceOverrideApplied,AttendanceRejected,AttendanceReversed}.php (new)
- app/Modules/Attendance/Providers/AttendanceServiceProvider.php (new)
- app/Modules/Attendance/Services/{AttendanceAuthorizer,AttendancePresenter,AttendanceRecordMutationService,AttendanceRecorderService,AttendanceSettingsService,MemberQrCredentialService}.php (new)
- app/Modules/Attendance/Controllers/{AttendanceCorrectionController,AttendanceMemberSearchController,AttendanceRecordController,AttendanceReversalController,AttendanceScanController,AttendanceSettingsController,LiveAttendanceController,ManualAttendanceController,QrCredentialController}.php (new)
- app/Modules/Attendance/Requests/{ManualAttendanceRequest,MutateAttendanceRecordRequest,RotateQrCredentialRequest,ScanAttendanceRequest,UpdateAttendanceSettingsRequest}.php (new)
- app/Modules/Attendance/Middleware/AttendanceScanRateLimit.php (new)
- app/Modules/Attendance/routes.php, app/Modules/Attendance/web.php (new)
- app/Modules/Attendance/INTEGRATION_NOTES.md (new — real content)
- app/Modules/Attendance/Models/{AttendanceCorrection,AttendanceRecord,AttendanceScanLog,AttendanceSetting}.php (modified — additive: enum casts, new fillable columns, append-only model hooks)
- database/migrations/2026_07_23_200200_create_attendance_tables.php (modified — removed a premature membership_id FK that referenced a not-yet-created table; see INTEGRATION_NOTES.md)
- database/migrations/2026_07_23_220200_add_attendance_membership_foreign_keys.php (new)
- database/migrations/2026_07_23_220201_extend_attendance_idempotency_and_presence.php (new)
- resources/js/modules/attendance/api/{attendance,attendance.test}.{ts,ts} (new)
- resources/js/modules/attendance/types.ts (new)
- resources/js/modules/attendance/components/{attendance-state,override-dialog,override-dialog.test}.tsx (new)
- resources/js/modules/attendance/pages/{correct-page,details-page,history-page,live-page,manual-page,scanner-page,scanner-page.test,settings-page}.tsx (new)
- resources/js/pages/attendance/{correct,details,history,live,manual,scanner,settings}.tsx (new)
- resources/js/actions/App/Modules/Attendance/** (new — generated Wayfinder actions)
- resources/js/routes/api/attendance/**, resources/js/routes/attendance/** (new — generated Wayfinder routes)
- tests/Feature/Attendance/{AttendanceSecurityMutationTest,AttendanceTestHelpers,AttendanceWorkflowTest}.php (new)
- tests/Unit/Attendance/AttendanceContractTest.php (new)
- .gitignore (modified — added /vendor-shared/)

Files intentionally not changed:
- app/Modules/Membership/** — the eligibility bug was fixed entirely on
  the Attendance side (see INTEGRATION_NOTES.md); Membership's
  MembershipAccessChecker was already correct.
- bootstrap/providers.php — AttendanceServiceProvider is not registered
  there; per plan section 14.2 that's an integration-owner action, listed
  under Integration requirements below.
- app/Modules/{Notification,Report,Audit,MemberPortal}/**,
  resources/js/modules/{dashboard,reports,member-portal,notifications}/**,
  resources/js/app/navigation.ts, app-sidebar.tsx, nav-main.tsx — outside
  Worktree 2 ownership (plan section 9.6).
- package.json/composer.json/lockfiles — not touched, no new dependency
  was needed (QR scanning uses the native BarcodeDetector API).
- vendor-shared/ — investigated and confirmed to be load-bearing
  infrastructure (a symlink farm sharing the main checkout's composer
  vendor/ across the three Phase 3 worktrees), not stray; left in place,
  added to .gitignore instead of deleting.
- ~65 unrelated Wayfinder-regenerated files (resources/js/actions/**,
  resources/js/routes/** outside Attendance) — running npm run build
  regenerates the entire Wayfinder tree, not just Attendance's; the
  unrelated diffs were pure @see docblock path noise from the
  vendor-shared symlink and were reverted before committing.
- PHASE3_TASK_BRIEF.md — a prior session's instructions to itself, left
  in place but not committed (not part of this deliverable).
- TEAM_LEAD_BRIEFING.md — deleted per its own closing instruction ("you
  may delete this briefing file... do not include it in a feature
  commit").

Routes added:
API (auth:sanctum, tenant, branch; /api/v1/attendance/*):
POST /scans, GET /scans/recent, POST /manual, GET /members/search,
GET /live, GET /records, GET /records/{attendanceRecord},
POST /records/{attendanceRecord}/checkout,
POST /records/{attendanceRecord}/corrections,
POST /records/{attendanceRecord}/reversal, GET /settings, PUT /settings,
GET /members/{member}/qr, POST /qr/rotate, DELETE /members/{member}/qr.

Inertia (auth, verified, tenant, branch; /attendance/*):
GET /scanner, GET /manual, GET /live, GET /history,
GET /records/{attendanceRecordId}, GET /records/{attendanceRecordId}/correct,
GET /settings.

Route names:
api.attendance.scans.store, api.attendance.scans.recent,
api.attendance.manual.store, api.attendance.members.search,
api.attendance.live.index, api.attendance.records.index,
api.attendance.records.show, api.attendance.records.checkout,
api.attendance.corrections.store, api.attendance.reversals.store,
api.attendance.settings.show, api.attendance.settings.update,
api.attendance.qr.show, api.attendance.qr.rotate, api.attendance.qr.revoke,
attendance.scanner, attendance.manual, attendance.live, attendance.history,
attendance.records.show, attendance.corrections.create, attendance.settings.

API endpoints:
See "Routes added" above; exact request/response shapes match plan
section 11.3 (accepted: {result, attendance_record_id, member, checked_in_at|
checked_out_at, replayed, override_applied}; rejected: 422/409 with
{success:false, message, errors:{reason_code:[...]}}). Full detail in
INTEGRATION_NOTES.md.

Database migrations:
2026_07_23_200200_create_attendance_tables.php (modified, additive —
membership_id FK deferred), 2026_07_23_220200_add_attendance_membership_foreign_keys.php
(new), 2026_07_23_220201_extend_attendance_idempotency_and_presence.php (new).

Contracts implemented:
App\Modules\Attendance\Contracts\AttendanceRecorder ->
AttendanceRecorderService; App\Modules\Attendance\Contracts\MemberQrCardProvider
-> MemberQrCredentialService (both bound in AttendanceServiceProvider,
not yet registered — see Integration requirements). Consumes
App\Modules\Membership\Contracts\MembershipAccessChecker (existing,
unmodified).

Permissions:
attendance.scan, attendance.manual, attendance.live.view,
attendance.history.view, attendance.correct, attendance.reverse,
attendance.override, attendance.settings.view, attendance.settings.update,
attendance.qr.manage. No dedicated permission seeder added yet (see
Integration requirements).

Domain events published:
App\Modules\Attendance\Events\AttendanceCheckedIn, AttendanceCheckedOut,
AttendanceCorrected, AttendanceOverrideApplied, AttendanceRejected,
AttendanceReversed. All dispatched via DB::afterCommit (rate-limit
rejection dispatches synchronously since no DB write precedes it), all
scalar-only payloads.

Domain events consumed:
None. Reused App\Modules\Membership\Contracts\MembershipAccessChecker as
a synchronous contract call, not an event.

Events and listeners:
No listeners registered by this module (notification delivery is
Worktree 3's responsibility per plan section 7.3).

Queue jobs:
None added.

Scheduled jobs:
None added.

Sidebar entries required:
Operations > Attendance > {QR Scanner -> attendance.scanner (Camera icon,
attendance.scan), Manual Check-in -> attendance.manual (UserCheck icon,
attendance.manual), Live Attendance -> attendance.live (Users icon,
attendance.live.view), Attendance History -> attendance.history (History
icon, attendance.history.view), Attendance Settings -> attendance.settings
(Settings icon, attendance.settings.view)}. Corrections are reached from a
history/detail row action, not a top-level nav entry.

Environment variables:
None added. QR signing reuses the existing APP_KEY.

Tests added:
tests/Feature/Attendance/AttendanceWorkflowTest.php (11 cases, one with 6
data-set variants — valid check-in/attribution, tampered/revoked/expired
QR, QR rotation without hash exposure, member/membership-status
rejections, plan/branch/visit-limit rules, idempotent replay vs. changed-
payload conflict, duplicate-scan window, check-in-only vs. check-in/
checkout mode, manager override + audit, manual-attendance toggle +
attribution, and events-only-dispatch-after-commit — added this session).
tests/Feature/Attendance/AttendanceSecurityMutationTest.php (9 cases —
append-only correction/reversal history, correction idempotency/conflict,
correction timestamp validation, permission + branch-scope enforcement,
cross-tenant route-model binding protection, bounded live attendance +
paginated history, recent-scan scoping, rate limiting, settings
validation/audit, append-only scan logs). tests/Unit/Attendance/
AttendanceContractTest.php (3 cases — command fingerprinting, result
serialization, event payload safety).

Commands executed:
php artisan test tests/Feature/Attendance tests/Unit/Attendance
php artisan test (full suite)
composer run lint:check
composer run types:check
npm run lint:check
npm run format:check
npm run types:check
npm run test
npm run build

Test results:
- php artisan test tests/Feature/Attendance tests/Unit/Attendance: PASS
  (29 tests, 268 assertions).
- php artisan test (full): PASS (222 tests, 971 assertions). Required
  creating a local .env (php artisan key:generate) since none existed in
  this worktree — pre-existing environment gap unrelated to Attendance,
  not committed (gitignored).
- composer run lint:check (Pint): PASS for every Attendance file (0
  flagged). FAIL repo-wide: 347 non-Attendance files flagged, all for
  the `line_ending` fixer (Windows CRLF checkout vs. Pint's expected LF)
  — pre-existing, not touched, per plan section 16 ("do not run a
  formatter that rewrites the entire repository").
- composer run types:check (Larastan): FAIL — environment/infrastructure
  issue, not an Attendance code defect. The vendor-shared/ symlink farm
  (see INTEGRATION_NOTES.md) makes PHPStan's phar bootstrap resolve
  __DIR__ to the physical file inside the main GMSv1 checkout, which then
  re-requires GMSv1's own vendor/autoload.php on top of this worktree's
  already-loaded one, fataling with "Cannot redeclare class
  ComposerAutoloaderInit...". Reproduces identically on `php vendor/bin/
  phpstan --version` alone (zero files analyzed), so it cannot be an
  Attendance-code static-analysis finding. Not fixable within Attendance-
  owned paths (would require changing the shared vendor-sharing
  infrastructure or vendor/phpstan itself). Documented as an integration
  issue below.
- npm run lint:check (ESLint): PASS, no output.
- npm run format:check (Prettier): PASS for every hand-written Attendance
  file (0 flagged). FAIL repo-wide: 358 files flagged (pre-existing
  baseline formatting drift plus this module's own Wayfinder-generated
  route/action files, which are auto-generated and not meant to be hand-
  formatted) — not touched, same rationale as lint:check.
- npm run types:check (tsc --noEmit): PASS, no output.
- npm run test (Vitest): PASS (42 tests across 15 files, including 3
  Attendance test files).
- npm run build (production Vite build): PASS.

Manual verification:
Not performed in-browser this session (backend/frontend automated test
suites plus a full production build were used to verify correctness; see
Test results). The scanner page was read and reasoned through in detail
(camera permission/unsupported/denied states, BarcodeDetector usage,
manual-paste fallback) but not exercised in a live browser.

Security checks:
- Idempotency: DB-level unique constraints (attendance_scan_logs.request_id
  lookup + row lock, attendance_corrections (tenant_id, request_id) unique,
  attendance_records.open_presence_key unique) back every write path, not
  just application-level checks — confirmed by reading the transaction/
  lock structure in AttendanceRecorderService and AttendanceRecordMutationService.
- QR secrets: only token_hash (sha256) is stored; the full token is never
  persisted or returned from any endpoint other than the issue/rotate
  response itself (by design — that's the one time the token must reach
  the client to render the QR code).
- Rejection reason codes: exactly the 14 codes from plan section 9.3,
  verified against Enums\AttendanceRejectionReason and the test suite.
- Domain events publish only after commit: verified by code inspection
  (DB::afterCommit throughout) and by a new test that wraps the HTTP
  request in an outer transaction, rolls it back, and asserts the event
  was never dispatched.
- Corrections/reversals are append-only at the model layer: verified by
  code inspection (LogicException thrown from updating/deleting hooks)
  and by AttendanceSecurityMutationTest's append-only assertions.
- Tenant/branch isolation: verified by code inspection (BelongsToTenant
  scope + explicit branch_id match + 404 on mismatch in every record-
  scoped controller action) and by AttendanceSecurityMutationTest's
  cross-tenant route-model-binding and branch-scope tests.
- Rate limiting: keyed by tenant+branch+staff+device+IP, returns the safe
  rate_limit_exceeded reason with a Retry-After header, verified by test.

Known limitations:
- AttendanceServiceProvider is not registered in bootstrap/providers.php
  (deliberately — see Integration requirements). The module works today
  because every consumer type-hints the concrete service classes, not the
  interfaces.
- No dedicated Attendance permission seeder; permission slugs are only
  created ad hoc by the test suite via firstOrCreate. Needs a real seeder
  entry in the shared permission catalogue at integration.
- composer run types:check could not be run to completion due to a
  pre-existing environment issue (see Test results / Potential conflict
  files) — Attendance code has not been verified against Larastan level 7
  in this session. Recommend the integration owner re-run it from a
  checkout without the vendor-shared symlink farm before Phase 3 sign-off.
- Manual/browser verification of the scanner UI was not performed.

Integration requirements:
1. Register AttendanceServiceProvider in bootstrap/providers.php.
2. Add the ten attendance.* permission slugs to
   app/Modules/AccessControl/Support/PermissionCatalog.php and assign to
   appropriate system roles (suggested split in INTEGRATION_NOTES.md).
3. Add the five sidebar entries listed above once Worktree 1 wires final
   navigation.
4. Re-run composer run types:check (Larastan) from an environment where
   vendor/phpstan is a real local install rather than resolving through
   the vendor-shared/ symlink chain, since that chain breaks PHPStan's
   phar bootstrap entirely (reproduces on --version alone, unrelated to
   any module's code) — see Known limitations.
5. Regenerate Wayfinder output once, repo-wide, after all three Phase 3
   branches merge (per plan section 11.1), rather than trusting any one
   branch's generated-file snapshot.

Potential conflict files:
- database/migrations/2026_07_23_200200_create_attendance_tables.php —
  modified (additive) in this branch; if another branch also touches this
  file, resolve by keeping both branches' changes, not choosing one side.
- .gitignore — added one line (/vendor-shared/); trivial to merge.
- resources/js/actions/**, resources/js/routes/**, resources/js/wayfinder/
  index.ts — Wayfinder-generated; expect the same regenerate-the-whole-
  tree behavior from the other two Phase 3 branches. Regenerate once at
  integration rather than merging generated-file diffs by hand.
- bootstrap/providers.php — will need one line added for
  AttendanceServiceProvider; likely also touched by the other two Phase 3
  branches' own service providers if they have one.
- app/Modules/AccessControl/Support/PermissionCatalog.php and system role
  seeding — all three Phase 3 branches propose new permission slugs; this
  is explicitly a merge-once file per plan section 12.1.

Recommended next step:
Proceed to Worktree 3 (phase-3/notifications-reports) per the plan's
required merge order (section 19.2), then complete the five integration
requirements above before wiring Worktree 1's dashboard/sidebar
consumption of the Attendance live/history APIs.

## Worktree 3: Notifications, Reports, Exports, Audit (Claude Janidu)

Agent: Claude Janidu
Worktree: ../gms-p3-claude-janidu
Branch: phase-3/notifications-reports

Summary:
Reviewed and finished a substantial pre-existing, uncommitted implementation
of Phase 3 Notifications, Reports, Exports and Audit (backend + frontend +
tests). The suite already reported 35/35 passing when this session began;
fixed a broken vendor junction (see Known limitations), fixed a batch of real
PHPStan findings, fixed a static-analysis-blocking additive migration
(variable table names prevented Larastan from ever seeing the new `branch_id`
columns), added 2 missing tests (scheduled-announcement exact dispatch
timing, cross-tenant audit route-model-binding denial), reverted ~65 files of
incidental Wayfinder regeneration noise, formatted the handful of owned
frontend files that failed `prettier --check`, and committed everything in 9
logical commits. Final state: 230/230 backend tests green (full suite, via
the documented workaround runner), 37/37 in this worktree's own owned test
directories, clean `pint --test`/`eslint`/`tsc --noEmit`/`prettier --check`/
`vitest run`/`npm run build` on all owned files.

Completed features:
- Notification templates/rules CRUD with channel-matched allow-listed
  {{ variable }} preview (HTML-escaped, never evaluates Blade/PHP/arbitrary
  expressions).
- Event-driven dispatch: MembershipActivated/Expiring/Expired/Renewed,
  Billing's BillingEventPublished outbox (PaymentCompleted/PaymentRefunded),
  and scalar MemberRegistered/AttendanceCheckedIn/AttendanceRejected (accepted
  as untyped `object` so this branch never couples to Worktree 2's classes).
- In-app + email delivery, deterministic idempotency key
  (source_event_id + rule_id + recipient_type + recipient_id + channel), retry
  backoff [10, 60, 300] with a 3-attempt terminal failure, and safe
  unconfigured-provider terminal failure for sms/whatsapp (no vendor
  integration exists or was added).
- Manual announcements: audience filters (branch/member-status/plan),
  schedule/cancel, exact-time dispatch (job releases itself until
  `scheduled_at`), cancellation rejected once dispatched.
- Notification center: unread count, mark-one/all read, ownership enforced
  through the caller's own user/member-portal-account, never a client ID.
- Member notification preferences (per channel + notification_type, `*`
  wildcard fallback).
- 14 canonical report keys (membership-summary, membership-sales, renewals,
  expiries, daily-attendance, peak-hours, member-frequency, sales,
  collections, outstanding-balances, refunds, staff-activity,
  notification-delivery, branch-performance), tenant/branch scoped, financial
  ones reconciled against Billing's integer-minor-unit Invoice/Payment/Refund
  records (verified: no shadow ledger).
- Operational dashboard aggregate with a separately gated financial section.
- Async CSV exports: queued -> processing -> completed/failed -> expired
  lifecycle, private disk storage, owner-or-permission download, expiry +
  scheduled cleanup command, retry.
- Audit: searchable list/detail (actor/action-prefix/entity/date/branch/
  support-access filters), append-only enforcement at the model layer
  (`updating`/`deleting` hooks throw `LogicException`), recursive redaction of
  the exact section 13 sensitive-key list before persistence, bounded async
  CSV export of audit logs.

Files changed:
- `app/Modules/Notification/**` (Contracts, DTOs, Services, Jobs, Listeners,
  Providers, Requests, Controllers, Models (branch_id additions), routes.php,
  web.php)
- `app/Modules/Report/**` (Contracts, DTOs, Services, Jobs, Console, Providers,
  Requests, Controllers, Models (ReportExport, no functional change), routes.php,
  web.php)
- `app/Modules/Audit/**` (Controllers, Jobs, Services, routes.php, web.php)
- `app/Modules/AccessControl/Models/AuditLog.php` and
  `app/Modules/AccessControl/Services/AuditLogger.php` (the plan-approved
  narrow exception: append-only enforcement, redaction, branch/request/ip/
  context columns)
- `database/migrations/2026_07_24_300300_extend_phase_three_notification_and_audit_context.php`
- `resources/js/modules/{notifications,reports/api,exports,audit}/**`,
  `resources/js/pages/{notifications,exports,audit}/**` (excluding
  `notifications/components/**` and `notifications/pages/member-notifications/**`)
- `tests/Feature/{Notification,Report,Export,Audit}/**`, `tests/worktree-pest.php`

Files intentionally not changed:
- Anything under `app/Modules/Attendance/**`, `app/Modules/MemberPortal/**`,
  `resources/js/modules/{attendance,member-portal,dashboard}/**`,
  `resources/js/modules/notifications/components/**`,
  `resources/js/modules/notifications/pages/member-notifications/**`,
  `resources/js/pages/dashboard.tsx`, `resources/js/pages/member-portal/**`,
  `resources/js/app/navigation.ts`, `app-sidebar.tsx`, `nav-main.tsx` — all
  prohibited per plan section 10.7.
- `bootstrap/providers.php`, `routes/console.php`,
  `app/Modules/AccessControl/Support/PermissionCatalog.php`, system role
  seeders, generated Wayfinder output (`resources/js/actions/**`,
  `resources/js/routes/**`) — shared/global files reserved for the
  integration owner (plan section 14.2). See Integration requirements below;
  none of this worktree's features are reachable in a real (non-test)
  environment until item 1 there lands.
- `package.json`/`composer.json`/lockfiles — untouched, no new dependency was
  needed.

Routes added:
See "API endpoints" below for the full list; Inertia web routes render
placeholder pages under `notifications.*`, `audit.*`, `exports.index` pending
Worktree 1's final navigation/page integration (the frontend pages this
worktree built are the real implementations wired to these routes already;
only the sidebar entry is pending).

Route names:
- `api.notification-templates.{index,store,show,update,destroy}`,
  `api.notification-templates.preview`
- `api.notification-rules.{index,store,show,update,destroy}`
- `api.notification-deliveries.{index,show,retry}`
- `api.announcements.{index,store,show,update,destroy,schedule,cancel}`
- `api.notifications.{index,unread-count,read,unread,mark-all-read}`
- `api.notification-preferences.{show,update}`
- `api.reports.{catalogue,show,print,dashboard.operational}`
- `api.report-exports.{store,index,show,download,retry}`
- `api.audit-logs.{index,show,exports.store}`
- `notifications.{index,templates.index,templates.create,templates.edit,rules.index,logs.index,announcements.index}`
- `audit.{index,show}`
- `exports.index`

API endpoints:
| Method/path | Route name | Permission |
| --- | --- | --- |
| `GET/POST /api/v1/notification-templates`, `GET/PUT/DELETE /api/v1/notification-templates/{notificationTemplate}` | `api.notification-templates.*` | `notifications.templates.{view,create,update,delete}` |
| `POST /api/v1/notification-templates/{notificationTemplate}/preview` | `api.notification-templates.preview` | `notifications.templates.view` |
| `GET/POST /api/v1/notification-rules`, `GET/PUT/DELETE /api/v1/notification-rules/{notificationRule}` | `api.notification-rules.*` | `notifications.rules.{view,create,update,delete}` |
| `GET /api/v1/notification-deliveries`, `GET /api/v1/notification-deliveries/{notificationDelivery}` | `api.notification-deliveries.{index,show}` | `notifications.logs.view` |
| `POST /api/v1/notification-deliveries/{notificationDelivery}/retry` | `api.notification-deliveries.retry` | `notifications.logs.retry` |
| `GET/POST /api/v1/announcements`, `GET/PUT/DELETE /api/v1/announcements/{announcement}` | `api.announcements.*` | `notifications.announcements.{view,create,update}` (delete reuses update) |
| `POST /api/v1/announcements/{announcement}/schedule` | `api.announcements.schedule` | `notifications.announcements.dispatch` |
| `POST /api/v1/announcements/{announcement}/cancel` | `api.announcements.cancel` | `notifications.announcements.cancel` |
| `GET /api/v1/notifications`, `GET /api/v1/notifications/unread-count` | `api.notifications.{index,unread-count}` | authenticated recipient ownership |
| `PATCH /api/v1/notifications/{notification}/read`\|`/unread` | `api.notifications.{read,unread}` | exact recipient ownership |
| `POST /api/v1/notifications/mark-all-read` | `api.notifications.mark-all-read` | authenticated recipient ownership |
| `GET/PUT /api/v1/notification-preferences` | `api.notification-preferences.*` | active member-portal account ownership |
| `GET /api/v1/reports/catalogue` | `api.reports.catalogue` | `reports.view` + per-report visibility |
| `GET /api/v1/reports/dashboard/operational` | `api.reports.dashboard.operational` | `dashboard.view` (+ `reports.financial.view` or `dashboard.financials.view` for the financial section) |
| `GET /api/v1/reports/{reportKey}` | `api.reports.show` | see Report catalogue permissions below |
| `GET /api/v1/reports/{reportKey}/print` | `api.reports.print` | same as show |
| `POST /api/v1/report-exports` | `api.report-exports.store` | report permission + `exports.create` |
| `GET /api/v1/report-exports`, `GET /api/v1/report-exports/{reportExport}` | `api.report-exports.{index,show}` | own exports or `exports.view-all` |
| `GET /api/v1/report-exports/{reportExport}/download` | `api.report-exports.download` | owner or `exports.download-all`, must be `completed` and unexpired |
| `POST /api/v1/report-exports/{reportExport}/retry` | `api.report-exports.retry` | owner or `exports.manage`, must be `failed` |
| `GET /api/v1/audit-logs`, `GET /api/v1/audit-logs/{auditLog}` | `api.audit-logs.{index,show}` | `audit.view` + branch scope |
| `POST /api/v1/audit-logs/exports` | `api.audit-logs.exports.store` | `audit.export` + branch scope, date range <= 366 days |

Database migrations:
- `2026_07_24_300300_extend_phase_three_notification_and_audit_context` —
  additive: nullable `branch_id` + index on `notification_templates`,
  `notification_rules`, `notifications`, `announcements`,
  `notification_deliveries`; `entity_identifier` + index on `audit_logs`;
  report-query indexes on `memberships` (`sold_at`, `expires_on`). No existing
  migration modified. Sequence `300300` is inside Worktree 3's assigned
  `300000`-`399999` range.

Contracts implemented:
- `App\Modules\Notification\Contracts\NotificationDispatcher` ->
  `DatabaseNotificationDispatcher`
- `App\Modules\Notification\Contracts\NotificationTemplateRenderer` ->
  `SafeNotificationTemplateRenderer`
- `App\Modules\Report\Contracts\ReportQuery` -> `DatabaseReportQuery`
- `App\Modules\Report\Contracts\ExportGenerator` -> `CsvExportGenerator`
(bindings registered in `NotificationServiceProvider`/`ReportServiceProvider`
— see Integration requirements: neither provider is globally registered yet)

Permissions:
```
notifications.templates.view
notifications.templates.create
notifications.templates.update
notifications.templates.delete
notifications.rules.view
notifications.rules.create
notifications.rules.update
notifications.rules.delete
notifications.logs.view
notifications.logs.retry
notifications.announcements.view
notifications.announcements.create
notifications.announcements.update
notifications.announcements.dispatch
notifications.announcements.cancel

reports.view
reports.membership.view
reports.attendance.view
reports.financial.view
reports.staff-activity.view
reports.notification-delivery.view
reports.branch-performance.view

exports.create
exports.view-all
exports.download-all
exports.manage

audit.view
audit.export
```
`dashboard.view` / `dashboard.financials.view` are reused, not redefined
(already exist in `PermissionCatalog.php` from Phase 2). The owner role
bypasses all of the above via `hasRole('owner')`; every other role needs the
exact slug. None of this worktree's slugs are in `PermissionCatalog.php` yet
— see Integration requirements.

Domain events published: none. This worktree only consumes events; it never
publishes new domain events (Notification deliveries/announcements are an
end state, not something other modules need to react to).

Domain events consumed:
- `App\Modules\Membership\Events\{MembershipActivated,MembershipExpiring,MembershipExpired,MembershipRenewed}`
- `App\Modules\Billing\Events\BillingEventPublished` (bridging its
  `PaymentCompleted`/`PaymentRefunded` envelope types; also listens for
  `App\Modules\Billing\Events\PaymentCompleted`/`PaymentRefunded` directly in
  case a future baseline dispatches them as first-class events instead of/in
  addition to the outbox envelope)
- `App\Events\MemberRegistered`,
  `App\Modules\Attendance\Events\{AttendanceCheckedIn,AttendanceRejected}` —
  registered by fully-qualified string class name (not `::class`) in
  `NotificationServiceProvider::boot()` specifically so this branch does not
  hard-depend on Worktree 2's not-yet-existing classes at parse time; Laravel
  resolves the listener lazily on dispatch. Confirm these exact class/event
  names once Worktree 2's `AttendanceCheckedIn`/`AttendanceRejected` and the
  integration owner's `MemberRegistered` land — a name mismatch here means
  the listener silently never fires (no error).

Events and listeners:
- `MembershipNotificationListener::handle` <- the four Membership events
  above. Derives its own idempotency source-id
  (`sha256(eventType|tenant_id|membership_id|updated_at)`) since Membership's
  events don't carry one.
- `BillingNotificationListener::handle` <- `BillingEventPublished` (keyed off
  its `type` property) and the two direct Billing payment events. Uses the
  event's own `eventId` as the idempotency source-id.
- `ScalarDomainNotificationListener::handle` <- MemberRegistered/Attendance
  events, accepted as untyped `object` (reads `->tenantId`, `->memberId`,
  `->eventId`/`->requestId`, `->branchId`, `->attendanceRecordId`,
  `->membershipId`, `->source`, `->result`, `->reasonCode`,
  `->overrideApplied`, `->registeredBy`, `->occurredAt` if present) so this
  branch never imports Worktree 2's or the integration owner's concrete event
  classes.
- All three registered in `NotificationServiceProvider::boot()` via
  `Event::listen()` — never in a Membership/Billing/Member/Attendance
  controller.

Queue jobs:
- `DeliverNotificationJob` (tries=3, backoff=[10,60,300]) — in_app/email
  delivery; sms/whatsapp fail immediately as
  `{channel}_provider_not_configured` (no retry, since no provider will ever
  become configured mid-retry).
- `DispatchAnnouncementJob` (tries=2) — releases itself
  (`max(1, diffInSeconds)`) until `scheduled_at`, then locks, dispatches per
  member per channel, marks `dispatched`.
- `GenerateReportExportJob` (tries=2, backoff=[30,180]) — streams a CSV via
  `CsvExportGenerator`, paginating the underlying report 100 rows at a time.
- `GenerateAuditExportJob` (tries=2, backoff=[30,180]) — streams a bounded
  (<=366-day) audit-log CSV.

Scheduled jobs:
- **Not yet scheduled** — `reports:expire-exports` (from
  `ExpireReportExportsCommand`) exists and is registered as an Artisan
  command (once `ReportServiceProvider` is globally registered — see
  Integration requirements) but has no `Schedule::command(...)` entry in
  `routes/console.php`. Add one; nothing currently expires exports or removes
  their private files outside a manual run or the test that exercises it
  directly.

Sidebar entries required:
```
Communication
└── Notifications
    ├── Notification Center        -> notifications.index (Worktree 1 owns this page)
    ├── Templates                  -> notifications.templates.index
    ├── Rules                      -> notifications.rules.index
    ├── Delivery Logs              -> notifications.logs.index
    └── Manual Announcements       -> notifications.announcements.index

Insights
├── Reports                        -> api.reports.catalogue (Worktree 1 builds the page; this worktree owns only the API)
├── Export History                 -> exports.index
└── Audit Logs                     -> audit.index
```
Suggested Lucide icons: `Bell` (Notifications parent), `FileText` (Templates),
`ListChecks` (Rules), `History` (Delivery Logs / Export History),
`Megaphone` (Manual Announcements), `BarChart3` (Reports), `ShieldCheck`
(Audit Logs). Hide `Templates`/`Rules`/`Delivery Logs`/`Manual Announcements`
individually per their view permission; hide the whole `Notifications` group
if none are visible (a recipient with no admin permissions should still see
the member-facing notification center, which is Worktree 1's route).

Environment variables: none added. No SMS/WhatsApp provider credentials
exist or were added — those channels intentionally always report
`{channel}_provider_not_configured` and terminate without retrying.

Tests added (this session, on top of what already existed):
- `tests/Feature/Notification/NotificationWorkflowTest.php`:
  `it dispatches a scheduled announcement only at or after its exact scheduled time`
- `tests/Feature/Audit/AuditSecurityTest.php`:
  `it returns not found for another tenant audit log via route-model binding`
(The rest of the 4 test files' 35 tests already existed and already passed
when this session began; reviewed all of them file-by-file against plan
sections 15.2-15.4 and found the existing coverage already addressed retry
backoff/max-attempts, SMS/WhatsApp unconfigured adapters, cancellation-after-
dispatch rejection, export expiration+cleanup, failed-export retry,
cross-tenant/cross-branch download denial, recursive nested-key redaction,
audit append-only rejection, and audit export events — see "Known
limitations" for the one thing not added: dedicated frontend component tests
for this worktree's own admin pages.)

Commands executed:
```
php tests/worktree-pest.php tests/Feature/Notification tests/Feature/Report tests/Feature/Export tests/Feature/Audit
php tests/worktree-pest.php tests/                      (full backend suite)
./vendor/bin/pint --test app/Modules/Notification app/Modules/Report app/Modules/Audit app/Modules/AccessControl/Models/AuditLog.php app/Modules/AccessControl/Services/AuditLogger.php database/migrations/2026_07_24_300300_extend_phase_three_notification_and_audit_context.php
./vendor/bin/phpstan analyse --memory-limit=1G           (repo-wide; composer's `types:check` script hits PHP's default 128M limit and crashes before completing, unrelated to this worktree's code)
npm run lint:check
npm run format:check   (then npx prettier --write on the 12 owned files it flagged)
npm run types:check
npm run test
npm run build
```

Test results:
- PASS — `php tests/worktree-pest.php tests/Feature/Notification tests/Feature/Report tests/Feature/Export tests/Feature/Audit`: 37 tests, 164 assertions, 0 failures.
- PASS — `php tests/worktree-pest.php tests/` (full backend suite, all modules): 230 tests, 867 assertions, 0 failures. (Started the session at 108 errors here, all `MissingAppKeyException` in non-owned modules like `tests/Feature/Tenancy/**` — root cause was a missing `.env`/`APP_KEY` in this worktree, unrelated to any Phase 3 Worktree 3 code; fixed once, not by editing any test.)
- FAIL (documented, not fixed) — `php artisan test` (plain, no workaround): fatals with an invalid-PHP-namespace error from Pest's bootstrap. Environment-specific to this symlinked/junctioned worktree; see Known limitations. Always use `php tests/worktree-pest.php ...` in this worktree.
- PASS (with caveats) — `composer run lint:check` (`pint --test`): fails repo-wide (~340 files) with pre-existing `line_ending` (CRLF) issues on files not owned by this worktree (dated from before this session, present on the baseline `dev` commit). Zero failures among this worktree's owned files (verified by scoping the same check to exactly the paths this worktree owns, see Commands executed).
- FAIL (documented, not fully fixed) — `composer run types:check` (`phpstan analyse`, default memory limit): the composer script itself crashes with a PHP memory-limit error before finishing (128M is too low for this repo's size at level 7 — a pre-existing environment/config gap, not something introduced here). Re-running the identical analysis with `--memory-limit=1G` completes; started at 100 errors across this worktree's owned files (all of which are new code from this worktree — 0 errors existed elsewhere in the repo when scoped identically), fixed 7 real issues down to 58 remaining, all in the two documented families in Known limitations (JSON-cast array-typing false positives, and Collection-generic non-covariance on private report-aggregation methods) plus one architectural decoupling tradeoff and one false-positive this worktree deliberately did not "fix" because doing so would introduce a real null-pointer bug.
- PASS — `npm run lint:check` (eslint): 0 errors/warnings on the whole repo.
- PASS (after one round of `prettier --write` scoped to owned files) — `npm run format:check`: repo-wide reports ~346 pre-existing unformatted files outside this worktree's ownership (untouched, documented only); the 12 files this worktree owns that initially failed are now formatted and pass.
- PASS — `npm run types:check` (`tsc --noEmit`): 0 errors.
- PASS — `npm run test` (vitest): 12 test files / 37 tests, all pre-existing (Phase 1/2 shared components + dashboard hooks) — this worktree added no new frontend component tests; see Known limitations.
- PASS — `npm run build`: production build succeeds, this worktree's pages/chunks (`template-form-page`, `audit`, `exports`, `logs`, `templates`, `announcements`, `rules`, etc.) are present in the manifest.

Manual verification:
Did not run the app in a browser this session (backend-first review/fix/test
task; no UI regressions were introduced — see "Known limitations" for the
one thing this implies: the admin pages built here have not been
click-tested end-to-end against a running server, only unit/type/build
verified).

Security checks (plan section 13):
- Tenant isolation: every query in `DatabaseReportQuery`, `DatabaseNotificationDispatcher`, `AuditLogController`, and all Notification controllers filters by `tenant_id` derived from the authenticated user/context, never a client-supplied value. Verified with two-tenant tests in all 4 test files.
- Branch scope: `ReportAuthorizer::context()`/`AuditAuthorizer::branches()` derive the caller's authorized branch set server-side; a requested `branch_id` outside that set 403s (tested).
- Recipient/member ownership: `NotificationCenterController`/`NotificationPreferenceController` resolve the member from the authenticated user's own `MemberPortalAccount`, never from a client-supplied member/notification-owner ID (tested: cross-tenant/cross-user 404s).
- IDOR: route-model binding on `AuditLog`/`NotificationDelivery`/`ReportExport`/etc. combines with the tenant global scope (`BelongsToTenant`) plus an explicit ownership/branch check in each controller (tested for audit logs, exports and notifications).
- Idempotency: notification delivery keyed by `sha256(source_event_id|rule_id|"member"|recipient_id|channel)`, enforced by a unique `(tenant_id, idempotency_key)` DB constraint via `firstOrCreate` (tested: duplicate event/rule/announcement dispatch produces exactly one delivery row).
- Append-only audit: `AuditLog::booted()` throws `LogicException` from `updating`/`deleting` model hooks; no update/delete route exists (tested at the model layer, not just by omission).
- Redaction: `SensitiveValueRedactor::redact()` recursively redacts the exact section-13 key list (password, password_confirmation, password_hash, token, access_token, refresh_token, authorization, api_key, secret, client_secret, card_number, pan, cvv, cvc, verification_value) plus any key ending in `_<sensitive>` (e.g. `old_password`), applied before persistence in `AuditLogger::log()`, not only at serialization (tested, including a nested-array case).
- Template preview: `SafeNotificationTemplateRenderer` only substitutes `{{ allow_listed_variable }}` tokens via `preg_replace_callback` + `e()` escaping; it never calls `eval`/Blade/`view()`/any dynamic-code path (tested: a `{{ php() }}`-shaped token in a template body is left as a literal, unescaped-but-inert string, and unknown variables throw `ValidationException` rather than being silently substituted).
- No provider credentials anywhere: SMS/WhatsApp channels have no adapter implementation at all (by design — plan section 10.2 forbids an unapproved vendor); they always terminate as `{channel}_provider_not_configured`. Grepped the diff for `api_key`/`secret`/`token` literals — none found outside the redaction key list and test fixtures.
- Export protection: exports are stored on the `local` disk under
  `report-exports/{tenant_id}/{export_id}.csv`; the API only ever streams
  through `Storage::disk()->download()` inside an authorized controller
  action — no raw path or signed URL is ever returned in a JSON response
  (verified: `assertJsonMissingPath('data.file_path')`/`'data.disk'` in the
  export-creation test).

Known limitations:
1. **`composer run types:check` remaining findings (58, all inside this
   worktree's owned files, none elsewhere in the repo).** Left undone rather
   than force-fixed because every remaining one falls into a class where the
   "obvious" fix per PHPStan's own suggestions would either be cosmetic noise
   or actively introduce a bug:
   - **JSON-cast attribute family** (`GenerateAuditExportJob`,
     `DeliverNotificationJob`, `DispatchAnnouncementJob`,
     `CsvExportGenerator`, `ReportExportController`,
     `SafeNotificationTemplateRenderer`, `DatabaseNotificationDispatcher`):
     Larastan infers `ReportExport::$filters`, `NotificationDelivery::$payload`,
     `Announcement::$channels`/`$audience_filters`, and
     `NotificationTemplate::$variables` as `array{}|string` instead of
     `array<string,mixed>|null`, even though each is cast via a Laravel 11
     method-based `protected function casts(): array` returning `'array'`
     (confirmed correct and working at runtime — every test reading these
     attributes passes). Root cause not fully isolated (suspected: Larastan's
     DB-schema-based property extension not fully honoring method-style
     `casts()` for JSON columns, falling back to a raw-column-type guess);
     did not "fix" by adding `@var`/casts at each call site per the tool's own
     instruction not to silence errors that way, and did not add
     blanket `@property` overrides on 4 different models for a
     tooling limitation with zero runtime impact.
   - **`Announcement::$scheduled_at` / `ReportExport::$filters` "cannot call
     isFuture() on string"** (`DispatchAnnouncementJob` line 28,
     `ReportExportController` line 84): same underlying inference gap,
     applied to a `datetime`-cast column instead of a JSON one.
   - **Collection-generic non-covariance** (`DatabaseReportQuery`'s 8 private
     aggregation methods, plus its public `catalogue()`): each returns a
     `Collection`/array of a specific literal shape
     (e.g. `array{status: string, total: int}`), which PHPStan considers
     incompatible with the declared `Collection<int, array<string, mixed>>`
     return type because `Collection`'s value template isn't covariant. Not
     a bug (verified via the financial-reconciliation and pagination tests);
     fixing it "properly" means either loosening every private method's
     docblock (purely cosmetic, no behavior change) or reshaping every row
     builder, neither of which seemed worth the diff size for a level-7
     nitpick with no runtime effect.
   - **`BillingNotificationListener`'s untyped `object $event` property
     access** (4 findings): deliberate, matching the documented pattern
     already used in `ScalarDomainNotificationListener` — this branch cannot
     import Worktree 2's/the integration owner's concrete event classes
     during parallel development, so listeners that bridge external events
     accept `object` and read properties dynamically. This is an
     architectural necessity, not an oversight.
   - **`DatabaseNotificationDispatcher::preferenceAllowsForMember`'s
     "unnecessary" nullsafe** (line 173, `$preference?->enabled ?? true`):
     PHPStan asserts `$preference` (from `->first()`) can never be null here
     and suggests removing the nullsafe operator. This is a false positive —
     `first()` returns `null` whenever no matching preference row exists
     (the common case), and removing the nullsafe per PHPStan's own
     suggestion would introduce a genuine null-pointer fatal error on every
     member without an explicit preference row. Deliberately left as-is.
   - Fixed instead (7 real issues, verified with `phpstan analyse` before/after
     and a full test re-run): `MembershipNotificationListener`'s
     unnecessary-but-actually-safe nullsafe on `starts_on`/`expires_on`
     (confirmed non-nullable via `Membership`'s own `@property` docblock);
     `AuditAuthorizer::branches()`/`DatabaseNotificationDispatcher::dispatchEvent()`
     not-provably-a-`list<int>` returns (wrapped with `array_values()`);
     `DispatchAnnouncementJob`'s float-vs-int `diffInSeconds()` delay
     argument; `NotificationPreferenceController`'s non-bool `abort_unless()`
     condition; `NotificationRuleController`'s untyped `find()` argument; and
     `StoreNotificationTemplateRequest`'s `is_object()`-vs-`instanceof Model`
     narrowing plus a redundant `?? []` on a `preg_match_all` capture group
     that always exists.
2. **`tests/worktree-pest.php` should be removed once this worktree merges
   into a single, non-junctioned tree.** It exists solely to work around the
   shared `vendor/` junction and Pest's namespace-generation bug on this
   worktree's absolute path; a normal checkout (one `vendor/` install, one
   real path) has neither problem, and `php artisan test`/plain `pest` should
   work directly there. Do not carry this file's classmap-remapping trick
   into the merged tree "just in case" — verify `php artisan test` works
   first and only then delete it.
3. **No dedicated frontend component tests for this worktree's own admin
   pages** (template list/form, rule list, delivery log, announcement page,
   export history, audit list/detail). `npm run test` (37 tests) covers only
   pre-existing Phase 1/2 shared components; this worktree's own pages are
   covered by `tsc --noEmit`, `eslint`, and a successful production build,
   but not by React Testing Library assertions. Plan section 15.6
   ("Presentation tests") is primarily Worktree 1's responsibility per
   section 8, but the handful of admin pages this worktree built were not
   given equivalent coverage; worth adding if time allows before final
   integration.
4. **No manual/browser verification was performed** on any of this worktree's
   pages this session (see Manual verification above).
5. **`composer run types:check`'s default memory limit (128M) is too low**
   for this repo at Larastan level 7 and crashes before producing any
   output; this is a pre-existing environment/config gap (the `phpstan.neon`
   / composer script doesn't set `--memory-limit`), not something introduced
   by this worktree. Use `./vendor/bin/phpstan analyse --memory-limit=1G`
   until that script is fixed.
6. The `vendor/` junction was found broken mid-session (see Integration
   requirements) and repaired; if a fresh clone of this worktree exhibits the
   same symptom, the fix is a two-line `Remove-Item`/`New-Item -ItemType
   Junction` (see INTEGRATION_NOTES.md for the exact commands) — this is
   infrastructure, not a code issue, and needed no source changes.

Integration requirements:
1. **Register both providers in `bootstrap/providers.php`** (blocking —
   without this, none of this worktree's notification delivery, event
   listening, or report/export contract bindings work outside the test
   suite):
   ```php
   App\Modules\Notification\Providers\NotificationServiceProvider::class,
   App\Modules\Report\Providers\ReportServiceProvider::class,
   ```
2. **Add the export-expiry schedule entry** to `routes/console.php`:
   `Schedule::command('reports:expire-exports')->daily();` (or an interval
   the integration owner prefers — nothing currently expires exports
   automatically).
3. **Merge this handoff's exact permission slugs** (see "Permissions" above)
   into `app/Modules/AccessControl/Support/PermissionCatalog.php` and assign
   them to the appropriate system roles (at minimum: give `manager`/
   equivalent admin roles the `*.view`/`*.create`/`*.update` slugs; keep
   `*.delete`, `notifications.announcements.dispatch`/`cancel`, `exports.*`,
   and `audit.*` restricted to more senior roles, matching the existing
   pattern for other modules' destructive/sensitive actions).
4. **Confirm the exact event class names** this worktree listens for by
   string (`App\Events\MemberRegistered`,
   `App\Modules\Attendance\Events\AttendanceCheckedIn`,
   `App\Modules\Attendance\Events\AttendanceRejected`) match what Worktree 2
   and the integration owner actually ship. A rename here means the listener
   silently never fires — no exception, no log, just no notification. Worth
   a manual smoke test (trigger a real attendance check-in / member
   registration end-to-end and confirm a `notification_deliveries` row
   appears) once all three branches are merged.
5. **Regenerate Wayfinder once**, after all three branches merge (`npm run
   build`), and commit that single regeneration — do not attempt to merge
   any worktree's own regenerated `resources/js/actions/**`/`resources/js/routes/**`
   diffs; discard them the same way this worktree's session did.
6. **Final navigation/sidebar wiring** is Worktree 1's job (plan section
   12.4) — this worktree only requests the entries listed under "Sidebar
   entries required" above. The Inertia routes/pages this worktree owns
   already exist and work; only the sidebar link and (for the notification
   center specifically) Worktree 1's own page are outstanding.
7. Confirm `MembershipAccessChecker`/attendance-side notification
   expectations (e.g. does a rejected attendance scan need a member-facing
   notification?) with Worktree 2 before assuming
   `ScalarDomainNotificationListener`'s variable set
   (`attendance_record_id`/`source`/`result`/`reason_code`/`override_applied`)
   is complete — it was built from the plan's section 7.3 event-payload list,
   not from Worktree 2's actual final event class (which did not exist yet
   during this session).

Potential conflict files:
- `bootstrap/providers.php`, `routes/console.php`,
  `app/Modules/AccessControl/Support/PermissionCatalog.php` and system role
  seeders — all three Phase 3 worktrees plus the integration owner will want
  to touch these; apply all three worktrees' required entries in one pass
  rather than three separate edits.
- `resources/js/actions/**`, `resources/js/routes/**`,
  `resources/js/wayfinder/index.ts` — every worktree's `npm run build`
  regenerates these; resolve by regenerating once post-merge, not by
  reconciling three sets of generated diffs.
- `resources/js/app/navigation.ts`, `app-sidebar.tsx`, `nav-main.tsx` — owned
  exclusively by Worktree 1; this worktree never touched them (confirmed via
  `git status`/`git diff` before every commit).

Recommended next step:
Merge `phase-3/presentation` and `phase-3/attendance` first (per the plan's
required order), then this branch, then apply the six "Integration
requirements" items above (providers, scheduler, permission catalogue, event
class-name confirmation, one Wayfinder regeneration, sidebar wiring) in a
single integration commit, then re-run this handoff's full command list
(`php artisan test` — should now work directly without the workaround runner
once the tree is unified — `composer run lint:check`/`types:check`, `npm run
lint:check`/`format:check`/`types:check`/`test`/`build`) against the merged
tree before declaring Phase 3 complete.

Commits (since 356f87b, `git log --oneline 356f87b..HEAD`):
```
9b006c3 test(notification,report,audit): add feature coverage for sections 15.2-15.4
42ff5b7 feat(notification,report,audit): add admin frontend API clients and pages
fce37d5 feat(notification,report,audit): add controllers and API/Inertia routes
8126aaa feat(notification,report): add validated form requests
3cf1f66 feat(notification,report,audit): add queue jobs, domain event listeners and service providers
3815135 feat(notification,report,audit): add dispatch, rendering, report query and authorization services
59d1b7b feat(notification,report): add domain contracts and DTOs
8f9b6df feat(notification,audit): stamp branch_id on notification models and enforce audit append-only + redaction
2b9a805 feat(notification,report,audit): add additive phase 3 migration
```
