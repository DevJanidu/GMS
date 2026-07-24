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
