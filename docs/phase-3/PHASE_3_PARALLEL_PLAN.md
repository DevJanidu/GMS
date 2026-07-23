# Phase 3 Parallel Implementation Plan

## 1. Document purpose and authority

This document is the implementation and integration plan for Phase 3 of the
Gym Management System:

> Attendance, Notifications, Reports and Member Portal.

It was prepared on 2026-07-24 after:

- reading all 1,368 lines of `SRS.md`;
- inspecting the current Git branch, status, branches and worktrees;
- inspecting the Laravel backend, Inertia/React frontend, routes, models,
  migrations, domain events, queues, scheduler, authorization, tenancy,
  navigation, API response format and tests; and
- reconciling the SRS with the additional Phase 3 requirements supplied in
  the Phase 3 master prompt.

`SRS.md` remains the project requirements source and must not be modified by
Phase 3 work. The Phase 3 master prompt supplements the shorter Phase 3
section in `SRS.md`; where it is more specific, this plan carries that
specificity forward.

No Phase 3 application code may start until the baseline gates in section 3
pass.

## 2. Phase 3 objective

Complete the operational platform with:

- secure QR attendance;
- phone-camera attendance scanning;
- manual attendance and controlled overrides/corrections;
- automated, event-driven notifications;
- operational and financial reports;
- asynchronous, expiring, protected exports;
- searchable, append-only and redacted audit functions; and
- a member self-service portal that exposes only the signed-in member's data.

Before parallel implementation begins, all Phase 3 worktrees must be created
from the same tested commit on the completed Phase 2 `dev` branch.

## 3. Baseline status, blockers and start gates

### 3.1 Verified repository state

At plan creation time:

| Item | Verified state |
| --- | --- |
| Current directory | `F:\2026\projects\gym-management-system\GMSv1` |
| Current branch | `dev` |
| Current commit | `75c69dc9082e0f8348ad92ab31a060347800f649` |
| Upstream | `origin/dev` |
| Phase 3 base branch | `dev` |
| Phase 3 remote base | `origin/dev` |
| Phase 3 branches | Do not exist |
| Phase 3 worktree directories | Do not exist |
| Working tree | Dirty; contains modified and untracked Phase 2-related files |
| Existing worktrees | Main checkout plus Phase 1 and Phase 2 worktrees |

The current dirty files are pre-existing user work and must not be discarded,
stashed, reset, overwritten or accidentally included in Phase 3 commits.

### 3.2 Canonical Phase 3 baseline

This project uses `dev` as its integration branch. For this repository, every
Phase 3 reference to the completed Phase 2 baseline means the tested `dev`
commit tracked by `origin/dev`.

Do not create or substitute another integration branch. All three Phase 3
worktrees must start from the same approved `dev` commit.

### 3.3 Mandatory start gates

The integration lead must confirm all of the following:

- `dev` and `origin/dev` identify the approved Phase 2
  integration commit;
- the main checkout used for setup is clean;
- Phase 2 migrations succeed on a fresh test database;
- Phase 2 backend tests, frontend tests, type checks and production build pass;
- the three Phase 3 branch names are unused or their existing state has been
  deliberately reviewed;
- the three target worktree directories are absent or their existing state has
  been deliberately reviewed;
- no worktree points at any of the three Phase 3 branches;
- all three new worktrees resolve to the same starting commit; and
- the shared contracts/events baseline decision in sections 6 and 7 has been
  recorded.

### 3.4 Assumptions and confirmed limitations

- In this repository, a gym is represented by a tenant plus its tenant-owned
  `gym_profiles` record. There is no separate `gym_id` on operational tables.
  Therefore "gym isolation" is enforced through authenticated tenant context.
- The SRS file contains the Phase 3 ranges `ATT-001` through `ATT-014`,
  `NOT-001` through `NOT-012`, `RPT-001` through `RPT-012`, and `SYS-005`,
  but does not contain individual requirement definitions for those IDs.
  Traceability must cover the behaviors named in the SRS and this plan; if a
  fuller requirements catalogue exists later, agents must map tests to it
  without weakening this plan.
- `SRS.md` illustrates a standalone `frontend/src` tree. The implemented
  application is an Inertia React application under `resources/js`. All Phase
  3 ownership paths in this plan use the verified `resources/js` architecture.
- Existing Phase 3 schema/model scaffolding is already present on the inspected
  `dev` commit. Agents must reuse it and add only additive migrations.
- Direct SMS and WhatsApp providers are not approved or installed. Phase 3
  supplies provider-neutral interfaces and disabled/unconfigured adapters,
  not provider credentials or speculative vendor code.

## 4. Guarded worktree recreation and terminal setup

Run these commands only after all section 3 gates pass, from a clean main
repository checkout. These commands intentionally stop for manual review when
a branch, registered worktree or directory already exists.

### 4.1 Confirm and update the approved base

```powershell
git branch --show-current
git status
git branch -a
git worktree list

git switch dev
git pull --ff-only origin dev
git status

if ((git branch --show-current) -ne 'dev') {
    throw 'Expected the dev branch.'
}

if (git status --porcelain) {
    throw 'The setup checkout is not clean.'
}

$phase3Base = git rev-parse dev
Write-Host "Phase 3 base commit: $phase3Base"
```

Use `--ff-only`; do not create an accidental merge commit while preparing the
shared baseline.

### 4.2 Safety checks for existing branches and directories

```powershell
$phase3Targets = @(
    @{
        Agent = 'Codex'
        Branch = 'phase-3/presentation'
        Directory = '../gms-p3-codex'
    },
    @{
        Agent = 'Claude Work'
        Branch = 'phase-3/attendance'
        Directory = '../gms-p3-claude-work'
    },
    @{
        Agent = 'Claude Janidu'
        Branch = 'phase-3/notifications-reports'
        Directory = '../gms-p3-claude-janidu'
    }
)

$registeredWorktrees = git worktree list --porcelain

foreach ($target in $phase3Targets) {
    $branchRef = "refs/heads/$($target.Branch)"
    git show-ref --verify --quiet $branchRef
    $branchExists = $LASTEXITCODE -eq 0
    $directoryExists = Test-Path -LiteralPath $target.Directory
    $worktreeMentionsBranch = $registeredWorktrees -match [regex]::Escape($branchRef)

    Write-Host "$($target.Agent): branch=$branchExists directory=$directoryExists registered=$worktreeMentionsBranch"

    if ($branchExists -or $directoryExists -or $worktreeMentionsBranch) {
        throw "Review the existing state for $($target.Agent) before recreating anything."
    }
}
```

If a target exists, inspect it with `git worktree list --porcelain`,
`git -C <directory> status`, `git -C <directory> log`, and remote branch
checks. Never delete a directory, remove a worktree or force-delete a branch
until its uncommitted and unpushed work has been preserved.

### 4.3 Create the worktrees

```powershell
git worktree add -b phase-3/presentation "../gms-p3-codex" dev
git worktree add -b phase-3/attendance "../gms-p3-claude-work" dev
git worktree add -b phase-3/notifications-reports "../gms-p3-claude-janidu" dev

git worktree list

$expectedBase = git rev-parse dev
$codexBase = git -C "../gms-p3-codex" rev-parse HEAD
$attendanceBase = git -C "../gms-p3-claude-work" rev-parse HEAD
$notificationBase = git -C "../gms-p3-claude-janidu" rev-parse HEAD

if (@($codexBase, $attendanceBase, $notificationBase) |
    Where-Object { $_ -ne $expectedBase }) {
    throw 'One or more Phase 3 worktrees do not use the approved base.'
}
```

### 4.4 Open separate VS Code windows

```powershell
code -n "../gms-p3-codex"
code -n "../gms-p3-claude-work"
code -n "../gms-p3-claude-janidu"
```

### 4.5 Open a separate PowerShell terminal for each agent

```powershell
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'Set-Location "../gms-p3-codex"; Write-Host "Agent: Codex | Branch: phase-3/presentation" -ForegroundColor Cyan; Get-Location; git branch --show-current; git status'
```

```powershell
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'Set-Location "../gms-p3-claude-work"; Write-Host "Agent: Claude Work | Branch: phase-3/attendance" -ForegroundColor Green; Get-Location; git branch --show-current; git status; claude-work'
```

```powershell
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'Set-Location "../gms-p3-claude-janidu"; Write-Host "Agent: Claude Janidu | Branch: phase-3/notifications-reports" -ForegroundColor Yellow; Get-Location; git branch --show-current; git status; claude-janidu'
```

Each terminal must remain in its assigned worktree. Before starting its AI
agent manually, run:

```powershell
Get-Location
git branch --show-current
git status
git rev-parse HEAD
```

Expected assignments:

| Terminal | Agent | Directory | Branch |
| --- | --- | --- | --- |
| 1 | Codex | `../gms-p3-codex` | `phase-3/presentation` |
| 2 | Claude Work | `../gms-p3-claude-work` | `phase-3/attendance` |
| 3 | Claude Janidu | `../gms-p3-claude-janidu` | `phase-3/notifications-reports` |

The exact Claude launch commands are:

```powershell
claude-work
```

```powershell
claude-janidu
```

Do not replace these with `claude`, aliases, alternate profiles or another
command. The `Start-Process` commands above run the matching command only
after changing into the assigned worktree and displaying its branch/status.

Optionally run `code -n .` from each correctly assigned terminal. Do not start
an agent from the main repository, and do not let an agent change into another
agent's worktree.

## 5. Verified architecture and conventions

### 5.1 Backend

- PHP 8.3 and Laravel 13.
- Domain modules live under `app/Modules/<Module>/**`.
- Module API routes live in `app/Modules/<Module>/routes.php`.
- `routes/api.php` auto-loads every module API route under `/api/v1`.
- Module Inertia routes live in `app/Modules/<Module>/web.php`.
- `routes/web.php` auto-loads every module `web.php`.
- APIs use session-cookie Sanctum authentication through `auth:sanctum`.
- API modules use `tenant` and, where a single acting branch is required,
  `branch` middleware.
- `App\Shared\Support\ApiResponse` defines the success, error and bounded
  pagination envelopes.
- Controllers delegate business rules to actions/services/queries and use
  Form Requests for validation.
- Module service bindings belong in module service providers, registered in
  `bootstrap/providers.php`.
- Module policies are registered explicitly because module namespaces are not
  convention-discovered.

### 5.2 Frontend

- React 19, TypeScript, Inertia 3, Tailwind CSS 4 and shadcn-style primitives.
- Source lives under `resources/js`, not `frontend/src`.
- Page entry points live under `resources/js/pages/**`.
- Module APIs, types, components and hooks live under
  `resources/js/modules/<module>/**`.
- Navigation metadata is auto-loaded from
  `resources/js/modules/**/navigation.ts` by
  `resources/js/app/navigation.ts`.
- `resources/js/components/app-sidebar.tsx` filters items and children with
  the fail-closed `can()` helper.
- The existing sidebar already supports mobile and collapsed icon modes.
- `resources/js/lib/api/client.ts` is the shared cookie/XSRF API client and
  prepends `/api/v1`.
- Laravel Wayfinder generates `resources/js/actions/**` and
  `resources/js/routes/**`; parallel branches must not hand-edit generated
  files. Regenerate once after integration to avoid cross-branch noise.

### 5.3 Tenancy, branch and authorization

- `IdentifyTenant` derives tenant context from the authenticated user.
- `BelongsToTenant` plus `TenantScope` scopes tenant-owned models and stamps
  new records.
- `SetBranchContext` accepts an assigned branch through `X-Branch-Id` or
  `branch_id`, with owner fallback behavior.
- Route-model binding is ordered after tenant/branch context to protect
  against cross-tenant IDOR.
- Roles and permissions use policies/Gates and permission slugs.
- The owner role bypasses Gate checks. Other users must have exact permission
  slugs.
- Frontend permission checks are visibility assistance only; every API must
  independently authorize.

### 5.4 Existing Phase 3 foundation to reuse

The inspected repository already contains:

- Attendance models and tables:
  `member_qr_credentials`, `attendance_settings`, `attendance_records`,
  `attendance_scan_logs`, `attendance_corrections`.
- Notification models and tables:
  `notification_templates`, `notification_rules`,
  `member_notification_preferences`, `notifications`, `announcements`,
  `notification_deliveries`, `notification_delivery_attempts`.
- Report export model/table: `ReportExport` and `report_exports`.
- Audit model/table: `App\Modules\AccessControl\Models\AuditLog`,
  `AuditLogger`, `audit_logs`, and the Phase 3 audit-context extension.
- Member portal model/table:
  `App\Modules\MemberPortal\Models\MemberPortalAccount` and
  `member_portal_accounts`.

Do not recreate these models or tables. Do not edit their already-shared
migrations. Add module-owned, additive migrations only if a verified
requirement cannot be met by the existing schema.

### 5.5 Existing source records for reports and member portal

Reports and portal reads must use:

- `App\Models\Member`;
- `App\Models\Plan`;
- `App\Modules\Membership\Models\Membership` and membership history/events;
- `App\Modules\Billing\Models\Invoice`;
- `App\Modules\Billing\Models\Payment`;
- `App\Modules\Billing\Models\Refund`;
- `App\Modules\Billing\Models\Receipt`;
- Attendance records created by Worktree 2;
- Notification deliveries created by Worktree 3; and
- the existing append-only audit log.

Financial values are stored in integer minor units in Billing. Reports must
aggregate those values and reconcile against the immutable source ledgers.

### 5.6 Queue, scheduler and tests

- Queue configuration and `jobs`/`failed_jobs` tables exist.
- Staff invitation provides an existing queued notification example.
- The scheduler lives in `routes/console.php`; membership expiry runs daily at
  `00:30`.
- Backend tests use Pest 4 and Laravel feature tests.
- Static analysis uses Larastan at level 7.
- Frontend tests use Vitest and Testing Library.
- Existing supported commands are listed in section 16.

## 6. Shared contracts and ownership

Create a contract only when an equivalent does not already exist. Keep
contracts narrow, typed and module-local unless multiple modules genuinely
need a shared namespace.

| Contract | Verified state | Canonical owner and decision |
| --- | --- | --- |
| `MembershipAccessChecker` | Exists at `app/Modules/Membership/Contracts/MembershipAccessChecker.php`, with a bound service | Existing Membership module owns it. Worktree 2 consumes it; do not create a duplicate. |
| `AttendanceRecorder` | Missing | Worktree 2, under `app/Modules/Attendance/Contracts/**`, implemented by an Attendance service/action. |
| `NotificationDispatcher` | Missing | Worktree 3, under `app/Modules/Notification/Contracts/**`. |
| `NotificationTemplateRenderer` | Missing | Worktree 3, under `app/Modules/Notification/Contracts/**`. |
| `ReportQuery` | Missing | Worktree 3, under `app/Modules/Report/Contracts/**`; use a report key plus validated filter DTO or typed per-report implementations. |
| `ExportGenerator` | Missing | Worktree 3, under `app/Modules/Report/Contracts/**` because the existing export model is owned by Report. Do not invent a second Export backend module unless implementation discovery proves one already exists. |
| `MemberPortalAuthorizer` | Missing | Worktree 1, under `app/Modules/MemberPortal/Contracts/**`, using the existing `MemberPortalAccount` relation and backend authorization patterns. |

Contract rules:

- Consumers depend on interfaces, not another module's controllers.
- Bindings belong in the provider of the implementing module.
- DTOs must contain safe scalar identifiers and required values, not serialized
  Eloquent models.
- A contract change after parallel work begins requires notification to all
  consumers and an integration note.
- Contract signatures and example payloads must be included in the owning
  branch handoff.

`MembershipAccessChecker` currently answers status/grace access only.
Attendance must layer member status, plan access, branch access, visit limits,
duplicate windows and settings around it; it must not expand or duplicate
Membership's lifecycle logic.

## 7. Required domain events

### 7.1 Event inventory and action

| Required event | Verified state | Owner/action |
| --- | --- | --- |
| `MemberRegistered` | Missing | Member owner/integration baseline must dispatch a safe event after registration commits. No parallel Phase 3 branch may add notification delivery to the Member controller. |
| `MembershipActivated` | Exists in Membership | Reuse. |
| `MembershipExpiring` | Exists in Membership | Reuse. |
| `MembershipExpired` | Exists in Membership | Reuse. |
| `MembershipRenewed` | Exists in Membership | Reuse. |
| `PaymentCompleted` | Exists as the `PaymentCompleted` type in Billing's transactional `BillingEventPublished` outbox event | Worktree 3 consumes/bridges the existing safe envelope using `eventId` for idempotency. Do not create a competing payment write path. |
| `PaymentRefunded` | Exists as the `PaymentRefunded` type in Billing's transactional `BillingEventPublished` outbox event | Same bridge rule as `PaymentCompleted`. |
| `AttendanceCheckedIn` | Missing | Worktree 2 creates and publishes it after commit. |
| `AttendanceRejected` | Missing | Worktree 2 creates it and publishes a safe rejection envelope. |

The integration baseline owner should add `MemberRegistered` within the
existing Member registration flow before parallel work when possible. If that
cannot occur before branching, record it as an integration-owned task; do not
let Worktree 3 edit Member controllers.

### 7.2 Optional Attendance events

Worktree 2 may add these only when needed by implemented workflows:

- `AttendanceCheckedOut`;
- `AttendanceCorrected`;
- `AttendanceOverrideApplied`; and
- `AttendanceReversed`.

### 7.3 Event safety and delivery rules

- Publish state-change events only after their database transaction commits.
- Attendance events contain event/request ID, tenant ID, branch ID, attendance
  record ID, member ID, optional membership ID, actor ID, device identifier,
  source, timestamp, result/reason code and override indicator as applicable.
- Do not serialize full Member, Membership, User, Payment or Attendance models
  into queued Attendance/Notification events.
- Do not include QR secrets, password data, tokens, provider credentials,
  private notes or unredacted request payloads.
- Notification listeners consume events and queue delivery; controllers never
  deliver notifications.
- Reports query source records and never mutate Membership, Billing or
  Attendance source modules.
- Listener and dispatch idempotency must survive queue retries.

## 8. Worktree 1: Codex presentation workstream

### 8.1 Identity

```text
Agent: Codex
Worktree: ../gms-p3-codex
Branch: phase-3/presentation
Base: dev
```

### 8.2 Responsibility

Worktree 1 owns Phase 3 presentation, the operational dashboard composition,
reports UI, member-facing notification UI, member portal UI, and final Phase 3
navigation integration.

It must not implement attendance rules, notification delivery, notification
template rendering, report aggregation or export generation.

The only backend exception is the member-portal read/authorization boundary
explicitly required by `MemberPortalAuthorizer`. It may expose read-only,
member-owned portal endpoints through `app/Modules/MemberPortal/**`; those
endpoints must delegate to existing source modules and must not duplicate their
business rules.

### 8.3 Operational dashboard

Implement responsive loading, empty, error and permission-denied states for:

- today's attendance;
- current present-member count;
- peak attendance periods;
- expiring memberships;
- failed notifications;
- outstanding balances;
- branch-performance comparison;
- renewal conversion; and
- recent system activity.

The dashboard consumes:

- Attendance Worktree 2 live/today APIs; and
- Worktree 3 executive/report APIs.

Temporary typed adapters may define backend response shapes during parallel
work. They may not return hardcoded production data. Final integration must
connect every section to a real API or render an explicit unavailable/error
state.

### 8.4 Reports interface

Implement:

- report catalogue;
- filter panel;
- date-range, branch, plan, member-status and payment-method filters;
- KPI cards, charts and drill-down tables;
- bounded pagination where required;
- export status and download-ready notifications;
- print-friendly layouts;
- loading, empty, error and permission-denied states; and
- responsive behavior.

Worktree 1 owns report presentation but not `resources/js/modules/reports/api/**`.

### 8.5 Notification center

Implement:

- notification center;
- unread counter;
- notification list;
- mark-one/read-unread actions supported by the API;
- mark-all-as-read action;
- notification details;
- permission-gated failed-delivery indicators;
- loading, empty and error states; and
- member-facing notification pages.

Worktree 1 consumes Worktree 3 notification APIs and does not own templates,
rules, delivery jobs or logs.

### 8.6 Member portal

Implement:

- dedicated member portal layout and mobile navigation;
- member dashboard and profile;
- secure QR membership card;
- active membership, start date, expiry date and status;
- payment history and receipt list;
- attendance history;
- member notifications;
- expired-membership warnings;
- frozen and suspended membership states; and
- loading, empty, error and authorization-denied states.

The server resolves the member from the authenticated
`MemberPortalAccount.user_id`. Never accept an arbitrary member ID as the
authority for a portal read. Admin-only notes, staff data, internal failure
details, audit data and other members' records must never be serialized.

### 8.7 Owned paths

Verified repository paths owned by Worktree 1:

```text
resources/js/modules/dashboard/**
resources/js/modules/reports/**
resources/js/modules/member-portal/**
resources/js/modules/notifications/components/**
resources/js/modules/notifications/pages/member-notifications/**

resources/js/pages/dashboard.tsx
resources/js/pages/reports/**
resources/js/pages/member-portal/**
resources/js/pages/notifications/member-notifications/**

app/Modules/MemberPortal/**
tests/Feature/MemberPortal/**
resources/js/**/member-portal*.test.*
```

Exceptions:

```text
resources/js/modules/reports/api/**
```

is owned by Worktree 3.

Worktree 1 is the only Phase 3 parallel branch allowed to modify these shared
presentation files if a verified need remains:

```text
resources/js/app/navigation.ts
resources/js/components/app-sidebar.tsx
resources/js/components/nav-main.tsx
resources/js/types/navigation.ts
```

The current auto-loading navigation and sidebar already support nested,
permission-filtered, mobile and collapsed navigation. Prefer adding
module-owned `navigation.ts` metadata over changing shared files.

### 8.8 Prohibited paths and behavior

Worktree 1 must not modify:

```text
app/Modules/Attendance/**
app/Modules/Notification/**
app/Modules/Report/**
app/Modules/Audit/**
resources/js/modules/attendance/**
resources/js/modules/notifications/api/**
resources/js/modules/notifications/pages/templates/**
resources/js/modules/notifications/pages/rules/**
resources/js/modules/notifications/pages/logs/**
resources/js/modules/notifications/pages/announcements/**
resources/js/modules/reports/api/**
resources/js/modules/exports/**
resources/js/modules/audit/**
resources/js/pages/attendance/**
resources/js/pages/exports/**
resources/js/pages/audit/**
```

It must not query/report financial data itself, bypass backend member ownership,
or retain temporary mock data after integration.

### 8.9 Completion handoff to other worktrees

Worktree 1 must publish:

- final component-consumed TypeScript response types;
- member portal route names;
- dashboard/report endpoint assumptions;
- all navigation entries it integrated;
- permission slugs used; and
- any API mismatch requiring integration.

## 9. Worktree 2: Claude Work attendance workstream

### 9.1 Identity

```text
Agent: Claude Work
Worktree: ../gms-p3-claude-work
Branch: phase-3/attendance
Base: dev
```

### 9.2 Backend responsibilities

Implement:

- secure, non-guessable member QR identifiers and safe rotation/revocation;
- QR request validation;
- tenant and branch validation derived from authenticated context;
- member status and active-membership validation;
- expiry, freeze and suspension validation;
- plan and branch access validation;
- visit-limit validation;
- duplicate-scan window;
- phone-camera, manual and configured attendance modes;
- check-in-only and check-in/check-out modes;
- controlled manager override with mandatory reason;
- device and staff attribution;
- attendance reversal and controlled correction;
- live present-member query;
- attendance history and detail APIs;
- recent scan results;
- scan rate limiting;
- request idempotency;
- branch attendance settings; and
- auditable Attendance actions.

Reuse the existing Attendance tables/models and the existing Membership access
contract. Correctness-sensitive record creation must use a transaction,
row-level locking where concurrency can race, the unique tenant/request ID,
and an idempotent response path.

### 9.3 Safe rejection contract

The scan/manual endpoint returns a stable safe reason code:

```text
member_not_found
member_inactive
membership_not_found
membership_not_active
membership_expired
membership_frozen
membership_suspended
branch_not_allowed
plan_access_denied
visit_limit_reached
already_checked_in
duplicate_request
invalid_qr
rate_limit_exceeded
```

The response may include a translated/user-safe message. It must not expose SQL
errors, stack traces, token hashes, cross-tenant existence, internal policy
details or provider data.

`duplicate_request` means the supplied request/idempotency key was already
processed. A duplicate scan within the configured window may return
`already_checked_in` or a documented success replay depending on whether the
same idempotency key was used; tests must distinguish the two cases.

### 9.4 Frontend responsibilities

Implement:

- mobile QR scanner;
- camera permission and camera-not-supported states;
- successful/rejected scan states with clear safe reasons;
- manual member search and manual check-in;
- live attendance and present-member list;
- attendance history and detail;
- attendance correction;
- manager override dialog;
- branch attendance settings;
- loading, empty and error states; and
- responsive layouts.

Use browser camera APIs without adding a dependency unless the native API and
existing dependencies cannot satisfy QR decoding. Any dependency request must
follow section 14.

### 9.5 Owned paths

```text
app/Modules/Attendance/**
resources/js/modules/attendance/**
resources/js/pages/attendance/**
tests/Feature/Attendance/**
tests/Unit/Attendance/**
```

Attendance-specific factories, policies, provider, module seeders, routes,
events, listeners and additive migrations are also owned by Worktree 2.

Expected module-local route files:

```text
app/Modules/Attendance/routes.php
app/Modules/Attendance/web.php
```

### 9.6 Prohibited paths and behavior

Worktree 2 must not modify:

```text
app/Modules/Notification/**
app/Modules/Report/**
app/Modules/Audit/**
app/Modules/MemberPortal/**
resources/js/modules/dashboard/**
resources/js/modules/reports/**
resources/js/modules/member-portal/**
resources/js/modules/notifications/**
resources/js/app/navigation.ts
resources/js/components/app-sidebar.tsx
resources/js/components/nav-main.tsx
```

It must not edit Membership internals to make access checks pass, implement
notification listeners/templates, implement report aggregation/export, or add
the final sidebar entries.

### 9.7 SRS coverage and handoff

Implement and test `ATT-001` through `ATT-014`, the phone-based workflow,
duplicate scanning, manager override, invalid membership rejection and all
attendance acceptance scenarios available in the SRS/master prompt.

The completion handoff must give Worktree 1:

- exact web and API route names;
- navigation labels and Lucide icon names;
- exact permission slugs;
- API request/response types;
- rejection reason mapping;
- settings/mode behavior; and
- any integration requirements.

## 10. Worktree 3: Claude Janidu notifications, reports, exports and audit

### 10.1 Identity

```text
Agent: Claude Janidu
Worktree: ../gms-p3-claude-janidu
Branch: phase-3/notifications-reports
Base: dev
```

### 10.2 Notification responsibilities

Implement:

- notification-template CRUD;
- notification-rule CRUD;
- email channel;
- provider-neutral SMS and WhatsApp interfaces;
- in-app notifications;
- delivery logs/status tracking;
- retry and failed-job behavior;
- delivery idempotency;
- manual announcements with validated audience filters;
- scheduled notification dispatch;
- member preferences;
- notification preview;
- cancellation before dispatch;
- unread count;
- mark-one and mark-all read actions;
- notification authorization; and
- tenant/branch isolation.

Notification listeners consume the events in section 7. They do not modify
Membership, Billing, Member or Attendance controllers.

Do not implement an unapproved SMS/WhatsApp vendor. Adapters must report
unconfigured/disabled status safely. No credentials belong in source control,
logs, payload snapshots or audit values.

### 10.3 Report responsibilities

Implement:

- executive dashboard API;
- membership summary;
- new-membership sales;
- renewals;
- expiries;
- daily attendance;
- peak hours;
- member frequency;
- sales;
- collections;
- outstanding balances;
- refunds;
- staff activity;
- notification delivery;
- branch performance;
- CSV export;
- print-friendly data;
- asynchronous large exports;
- expiration/cleanup;
- protected downloads;
- validated filters and bounded pagination;
- permission-controlled access; and
- efficient tenant/branch-scoped aggregations.

Financial reports query and reconcile Billing source records. Do not create an
uncontrolled copy of financial values. A projection is allowed only if the
existing architecture later proves it necessary and includes replay,
reconciliation and idempotency tests.

### 10.4 Audit responsibilities

Implement:

- searchable audit list and details;
- actor, entity, date and branch filters;
- before-and-after values;
- export audit events;
- support-access context;
- redaction;
- append-only enforcement;
- permission-controlled access; and
- tenant/branch isolation.

Never store:

- passwords or password hashes;
- authentication/session/CSRF tokens;
- API keys;
- provider secrets;
- full payment-card data;
- CVV or other verification values; or
- unredacted private credentials.

The repository's canonical Audit model and logger currently live in
AccessControl. To avoid a duplicate model/table, Worktree 3 owns this narrow
Phase 3 exception:

```text
app/Modules/AccessControl/Models/AuditLog.php
app/Modules/AccessControl/Services/AuditLogger.php
```

Only audit append-only/redaction/context changes are allowed there. Role,
permission and other AccessControl internals remain prohibited.

### 10.5 Frontend responsibilities

Implement:

- template list/create/edit;
- notification rules;
- notification logs;
- manual announcements;
- report API integration adapters;
- export history/download;
- audit list/details;
- loading, empty, error and permission-denied states; and
- responsive administration layouts.

### 10.6 Owned paths

```text
app/Modules/Notification/**
app/Modules/Report/**
app/Modules/Audit/**
app/Modules/AccessControl/Models/AuditLog.php
app/Modules/AccessControl/Services/AuditLogger.php

resources/js/modules/notifications/api/**
resources/js/modules/notifications/pages/templates/**
resources/js/modules/notifications/pages/rules/**
resources/js/modules/notifications/pages/logs/**
resources/js/modules/notifications/pages/announcements/**
resources/js/modules/reports/api/**
resources/js/modules/exports/**
resources/js/modules/audit/**

resources/js/pages/notifications/templates/**
resources/js/pages/notifications/rules/**
resources/js/pages/notifications/logs/**
resources/js/pages/notifications/announcements/**
resources/js/pages/exports/**
resources/js/pages/audit/**

tests/Feature/Notification/**
tests/Feature/Report/**
tests/Feature/Export/**
tests/Feature/Audit/**
tests/Unit/Notification/**
tests/Unit/Report/**
```

Expected route files:

```text
app/Modules/Notification/routes.php
app/Modules/Notification/web.php
app/Modules/Report/routes.php
app/Modules/Report/web.php
app/Modules/Audit/routes.php
app/Modules/Audit/web.php
```

The existing `ReportExport` means exports remain part of Report backend unless
an existing dedicated `app/Modules/Export/**` module appears on the approved
baseline. Do not create both.

### 10.7 Prohibited paths and behavior

Worktree 3 must not modify:

```text
app/Modules/Attendance/**
app/Modules/MemberPortal/**
resources/js/modules/attendance/**
resources/js/modules/member-portal/**
resources/js/modules/dashboard/**
resources/js/modules/notifications/components/**
resources/js/modules/notifications/pages/member-notifications/**
resources/js/pages/dashboard.tsx
resources/js/pages/member-portal/**
resources/js/pages/notifications/member-notifications/**
resources/js/app/navigation.ts
resources/js/components/app-sidebar.tsx
resources/js/components/nav-main.tsx
```

It must not put notification delivery into source controllers, mutate source
records from reports, expose export storage paths, or add final sidebar
entries.

### 10.8 SRS coverage and handoff

Implement and test `NOT-001` through `NOT-012`, `RPT-001` through `RPT-012`,
`SYS-005`, the reporting catalogue, export/audit requirements and notification
retry/idempotency requirements.

The completion handoff must give Worktree 1:

- exact web/API route names;
- navigation labels and Lucide icon names;
- exact permission slugs;
- report catalogue keys and filter support;
- response types and pagination;
- export status lifecycle; and
- integration requirements.

## 11. Route ownership and API contracts

### 11.1 Route rules

- API routes use `/api/v1`, `auth:sanctum`, `tenant` and appropriate branch
  enforcement.
- Inertia routes use `auth`, `verified`, `tenant` and appropriate branch
  enforcement.
- Each backend module owns `routes.php` and `web.php`.
- The existing glob loaders mean no Phase 3 worktree should edit
  `routes/api.php` or `routes/web.php`.
- If a global registration edit is unexpectedly required, only the final
  integration owner may make it after all branches are merged.
- Route names use current conventions: `api.<module>.*` for APIs and
  `<module>.*` for Inertia routes.
- Do not hand-edit generated Wayfinder files. Regenerate them once during
  integration.

### 11.2 Shared API envelope

Success:

```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

Paginated:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 0,
    "last_page": 1
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Safe message",
  "errors": {
    "field": ["Validation message"]
  }
}
```

All list endpoints cap `per_page` at 100 unless a stricter report-specific cap
is documented. Large result sets use asynchronous exports, not unbounded API
responses.

### 11.3 Attendance API contract

The exact controller names may follow implementation discovery, but these
paths, route names and semantics are the shared contract:

| Method/path | Route name | Permission | Purpose |
| --- | --- | --- | --- |
| `POST /api/v1/attendance/scans` | `api.attendance.scans.store` | `attendance.scan` | Idempotent QR scan/check-in or check-out; rate limited. |
| `POST /api/v1/attendance/manual` | `api.attendance.manual.store` | `attendance.manual` | Manual attendance using server-resolved member/membership. |
| `GET /api/v1/attendance/live` | `api.attendance.live.index` | `attendance.live.view` | Present members and count for authorized branch scope. |
| `GET /api/v1/attendance/records` | `api.attendance.records.index` | `attendance.history.view` | Filtered, paginated history. |
| `GET /api/v1/attendance/records/{attendanceRecord}` | `api.attendance.records.show` | `attendance.history.view` | Detail with safe attribution/corrections. |
| `POST /api/v1/attendance/records/{attendanceRecord}/checkout` | `api.attendance.records.checkout` | `attendance.scan` | Controlled check-out where mode allows it. |
| `POST /api/v1/attendance/records/{attendanceRecord}/corrections` | `api.attendance.corrections.store` | `attendance.correct` | Append-only correction with before/after values and reason. |
| `POST /api/v1/attendance/records/{attendanceRecord}/reversal` | `api.attendance.reversals.store` | `attendance.reverse` | Controlled reversal; never destructive delete. |
| `GET /api/v1/attendance/scans/recent` | `api.attendance.scans.recent` | `attendance.scan` | Recent results for the acting branch/device. |
| `GET /api/v1/attendance/settings` | `api.attendance.settings.show` | `attendance.settings.view` | Current branch settings. |
| `PUT /api/v1/attendance/settings` | `api.attendance.settings.update` | `attendance.settings.update` | Validate and update branch settings. |
| `POST /api/v1/attendance/qr/rotate` | `api.attendance.qr.rotate` | Member portal ownership or `attendance.qr.manage` | Rotate/revoke credential without revealing stored hashes. |

Minimum scan request:

```json
{
  "qr_token": "opaque signed/random token",
  "request_id": "uuid",
  "source": "phone_camera",
  "device_id": "optional bounded identifier",
  "action": "auto"
}
```

`branch_id`, `tenant_id`, `staff_id`, result and timestamps are server-derived.
The client may send `X-Branch-Id` only as a branch selection hint validated by
`SetBranchContext`.

Accepted result:

```json
{
  "success": true,
  "data": {
    "result": "checked_in",
    "attendance_record_id": 123,
    "member": {
      "id": 45,
      "member_number": "MEM-000045",
      "display_name": "Safe display name"
    },
    "checked_in_at": "2026-07-24T10:00:00+05:30",
    "replayed": false,
    "override_applied": false
  }
}
```

Rejected scan uses an appropriate HTTP status plus:

```json
{
  "success": false,
  "message": "Membership has expired.",
  "errors": {
    "reason_code": ["membership_expired"]
  }
}
```

The rate limiter should key by tenant, acting branch, authenticated staff and
device/IP as available. It must return `rate_limit_exceeded` safely.

### 11.4 Notification API contract

| Method/path | Route name | Permission/ownership |
| --- | --- | --- |
| Resource `/api/v1/notification-templates` | `api.notification-templates.*` | `notifications.templates.*` |
| Resource `/api/v1/notification-rules` | `api.notification-rules.*` | `notifications.rules.*` |
| `POST /api/v1/notification-templates/{template}/preview` | `api.notification-templates.preview` | `notifications.templates.view` |
| `GET /api/v1/notification-deliveries` | `api.notification-deliveries.index` | `notifications.logs.view` |
| `GET /api/v1/notification-deliveries/{delivery}` | `api.notification-deliveries.show` | `notifications.logs.view` |
| `POST /api/v1/notification-deliveries/{delivery}/retry` | `api.notification-deliveries.retry` | `notifications.logs.retry` |
| Resource `/api/v1/announcements` | `api.announcements.*` | `notifications.announcements.*` |
| `POST /api/v1/announcements/{announcement}/schedule` | `api.announcements.schedule` | `notifications.announcements.dispatch` |
| `POST /api/v1/announcements/{announcement}/cancel` | `api.announcements.cancel` | `notifications.announcements.cancel` |
| `GET /api/v1/notifications` | `api.notifications.index` | Authenticated recipient ownership |
| `GET /api/v1/notifications/unread-count` | `api.notifications.unread-count` | Authenticated recipient ownership |
| `PATCH /api/v1/notifications/{notification}/read` | `api.notifications.read` | Exact recipient ownership |
| `PATCH /api/v1/notifications/{notification}/unread` | `api.notifications.unread` | Exact recipient ownership |
| `POST /api/v1/notifications/mark-all-read` | `api.notifications.mark-all-read` | Authenticated recipient ownership |
| `GET/PUT /api/v1/notification-preferences` | `api.notification-preferences.*` | Member ownership or approved staff permission |

Template variables must be allow-listed per event type. Preview uses supplied
safe sample values; it must not evaluate arbitrary code, Blade/PHP, filesystem
paths or untrusted dynamic expressions.

Delivery idempotency key composition must be deterministic, for example:

```text
source_event_id + rule_id + recipient_type + recipient_id + channel
```

### 11.5 Report and export API contract

Canonical report keys:

```text
membership-summary
membership-sales
renewals
expiries
daily-attendance
peak-hours
member-frequency
sales
collections
outstanding-balances
refunds
staff-activity
notification-delivery
branch-performance
```

| Method/path | Route name | Permission |
| --- | --- | --- |
| `GET /api/v1/reports/catalogue` | `api.reports.catalogue` | `reports.view` plus per-report visibility |
| `GET /api/v1/reports/dashboard/operational` | `api.reports.dashboard.operational` | `dashboard.view`; financial sections also require financial permission |
| `GET /api/v1/reports/{reportKey}` | `api.reports.show` | `reports.<report-key>.view` or documented grouped permission |
| `GET /api/v1/reports/{reportKey}/print` | `api.reports.print` | Same report permission |
| `POST /api/v1/report-exports` | `api.report-exports.store` | Report view plus `exports.create` |
| `GET /api/v1/report-exports` | `api.report-exports.index` | Own exports or `exports.view-all` |
| `GET /api/v1/report-exports/{reportExport}` | `api.report-exports.show` | Owner or `exports.view-all` in tenant/branch scope |
| `GET /api/v1/report-exports/{reportExport}/download` | `api.report-exports.download` | Owner or `exports.download-all`, unexpired and completed |
| `POST /api/v1/report-exports/{reportExport}/retry` | `api.report-exports.retry` | Owner or `exports.manage` |

Common validated filters:

```json
{
  "date_from": "2026-07-01",
  "date_to": "2026-07-31",
  "branch_id": 1,
  "plan_id": 2,
  "member_status": "active",
  "payment_method": "cash",
  "page": 1,
  "per_page": 20
}
```

Each report declares supported filters in the catalogue. Unknown filters are
rejected. Date range has a bounded maximum appropriate to the report. Tenant,
gym and accessible branches are server-derived; a requested branch must be
inside the user's authorized branch set.

Exports persist a private disk/path, status, filters, row count and expiry.
Download responses stream through an authorized controller or short-lived
signed URL. The API never exposes an unrestricted storage path.

Export states:

```text
queued -> processing -> completed -> expired
                    \-> failed
```

Retry creates a controlled new attempt or resets only a failed record according
to the documented implementation. Completed exports are immutable.

### 11.6 Audit API contract

| Method/path | Route name | Permission |
| --- | --- | --- |
| `GET /api/v1/audit-logs` | `api.audit-logs.index` | `audit.view` |
| `GET /api/v1/audit-logs/{auditLog}` | `api.audit-logs.show` | `audit.view` and tenant/branch access |
| `POST /api/v1/audit-logs/exports` | `api.audit-logs.exports.store` | `audit.export` |

Supported filters include actor, action, entity type, entity ID, date range,
branch and support-access context. Values are redacted before persistence, not
only when serialized. Audit update/delete APIs do not exist.

### 11.7 Member portal API contract

| Method/path | Route name | Authority |
| --- | --- | --- |
| `GET /api/v1/member-portal/dashboard` | `api.member-portal.dashboard` | Active portal account, server-resolved member |
| `GET /api/v1/member-portal/profile` | `api.member-portal.profile.show` | Own member |
| `PUT /api/v1/member-portal/profile` | `api.member-portal.profile.update` | Own allow-listed profile fields |
| `GET /api/v1/member-portal/qr-card` | `api.member-portal.qr-card` | Own member |
| `GET /api/v1/member-portal/membership` | `api.member-portal.membership` | Own current/history summary |
| `GET /api/v1/member-portal/payments` | `api.member-portal.payments` | Own Billing records |
| `GET /api/v1/member-portal/receipts` | `api.member-portal.receipts.index` | Own receipts |
| `GET /api/v1/member-portal/receipts/{receipt}` | `api.member-portal.receipts.show` | Receipt belongs to own invoice/member |
| `GET /api/v1/member-portal/attendance` | `api.member-portal.attendance` | Own attendance |
| `GET /api/v1/member-portal/notifications` | `api.member-portal.notifications` | Own notifications |

Portal routes must never take `{member}` from the client. Nested receipt or
notification identifiers are resolved through the authenticated member's
relationship, producing 404/403 without confirming another member's record
exists.

## 12. Permissions and sidebar ownership

### 12.1 Proposed canonical permission slugs

Use existing naming style and avoid aliases/duplicates:

```text
attendance.scan
attendance.manual
attendance.live.view
attendance.history.view
attendance.correct
attendance.reverse
attendance.override
attendance.settings.view
attendance.settings.update
attendance.qr.manage

notifications.center.view
notifications.failures.view
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

member-portal.access
```

Each worktree may add a module-local permission seeder. Because the shared
permission catalogue is a potential conflict file, the final integration owner
must merge the exact handoff slugs into
`app/Modules/AccessControl/Support/PermissionCatalog.php` and system role
seeding once.

Member notification/portal ownership is not granted merely by a permission
slug; the backend must also match the authenticated portal account to the
record owner.

### 12.2 Staff sidebar

Worktree 1 performs final navigation after Worktrees 2 and 3 provide exact
route names, labels, permissions and icons.

Recommended structure:

```text
Dashboard
└── Operational Dashboard

Operations
└── Attendance
    ├── QR Scanner
    ├── Manual Check-in
    ├── Live Attendance
    ├── Attendance History
    ├── Attendance Corrections
    └── Attendance Settings

Communication
└── Notifications
    ├── Notification Center
    ├── Templates
    ├── Rules
    ├── Delivery Logs
    └── Manual Announcements

Insights
├── Reports
│   ├── Report Catalogue
│   ├── Membership Summary
│   ├── Membership Sales
│   ├── Renewals
│   ├── Expiries
│   ├── Attendance
│   ├── Peak Hours
│   ├── Member Frequency
│   ├── Sales
│   ├── Collections
│   ├── Outstanding Balances
│   ├── Refunds
│   ├── Staff Activity
│   ├── Notification Delivery
│   └── Branch Performance
├── Export History
└── Audit Logs

Member Experience
└── Member Portal Preview
```

The current navigation type supports only a parent and one child level.
Therefore Reports can be represented as a single Reports parent whose children
are the catalogue and individual reports; `Export History` and `Audit Logs`
should be their own top-level items in the `Insights` group. Do not introduce
a second sidebar component solely to reproduce deeper ASCII nesting.

### 12.3 Member portal navigation

```text
Dashboard
QR Card
Membership
Payments
Receipts
Attendance
Notifications
Profile
```

### 12.4 Sidebar rules

- Preserve Phase 1 and Phase 2 links.
- Use existing Lucide icons where possible.
- Use module-owned `navigation.ts` exports and exact final route names.
- Hide parent entries when all children are unauthorized.
- Hide every unauthorized child.
- Preserve mobile and collapsed-sidebar behavior.
- Avoid duplicate routes and labels.
- Never expose admin navigation in the member portal.
- Worktrees 2 and 3 only report desired navigation in their handoffs; they do
  not edit the shared sidebar/navigation registry.

## 13. Mandatory security and data-integrity rules

Every Phase 3 endpoint, job, listener, query and download must:

- enforce tenant/gym isolation from authenticated context;
- enforce authorized branch scope;
- enforce member ownership for portal and recipient records;
- use existing RBAC policies/Gates;
- validate and normalize every input;
- prevent IDOR through scoped queries and authorization;
- reject client-supplied tenant/gym/staff identity as authority;
- treat client branch ID only as an authorized selection hint;
- rate-limit QR scanning and other sensitive endpoints;
- use idempotency for Attendance writes and notification delivery;
- use cryptographically random or signed QR credentials whose stored secret is
  hashed and never returned;
- rotate/revoke QR credentials safely;
- protect export creation, metadata and download;
- expire exports and remove their private files through a scheduled cleanup;
- redact secrets and sensitive fields before audit persistence;
- record manager overrides, corrections, reversals, dispatches, retries,
  template/rule changes, exports/downloads, and other high-value admin actions;
- avoid provider credentials in source, client responses, events, logs, queue
  payloads or audits;
- prevent mass assignment of tenant, branch, actor and ownership fields; and
- return safe error messages without leaking cross-tenant record existence.

Concurrency-sensitive Attendance and financial/report snapshot operations must
be tested with repeated requests. Database uniqueness is the final idempotency
guard; application pre-checks alone are insufficient.

Audit records are append-only. The Audit model must reject update and delete at
the model/service layer, and the application must expose no update/delete
routes. Redaction must recursively handle keys such as:

```text
password
password_confirmation
password_hash
token
access_token
refresh_token
authorization
api_key
secret
client_secret
card_number
pan
cvv
cvc
verification_value
```

## 14. Conflict prevention and dependency rules

### 14.1 Shared files

Only the assigned owner may edit a shared file. If another worktree needs a
change, it records the exact request in its handoff/`INTEGRATION_NOTES.md`.

Worktree 1 owns shared frontend navigation and Phase 3 presentation
integration. Worktree 2 owns all Attendance internals. Worktree 3 owns
Notification, Report, Export-through-Report and Audit internals.

### 14.2 Global registration

- Do not let all agents edit global route/provider/scheduler files in parallel.
- Module routes are auto-loaded; use module `routes.php` and `web.php`.
- Module bindings should be isolated in module providers.
- Each worktree must document provider/scheduler registration needed.
- The final integration owner applies unavoidable changes once to:
  `bootstrap/providers.php`, `routes/console.php`, permission catalogue/system
  role seeders, and generated Wayfinder output.

### 14.3 Dependency files

Do not modify unless absolutely required:

```text
package.json
package-lock.json
pnpm-lock.yaml
yarn.lock
composer.json
composer.lock
```

When unavoidable:

1. demonstrate why native APIs and current dependencies cannot complete the
   requirement;
2. inform the other worktrees before integration;
3. put the dependency and lockfile change in a separate commit;
4. document version, purpose, license/security review and affected build;
5. keep only one package manager (`npm`, as currently configured); and
6. make the integration owner resolve lockfile conflicts deliberately.

### 14.4 Migrations

- Reuse the existing Phase 3 migrations and schema.
- Never modify, rename or replace an already-shared migration.
- Use additive migrations with the owning module clearly named.
- Inspect the live schema/model before adding a table or column.
- Preserve foreign-key and migration ordering.
- Do not create duplicate Attendance, Notification, ReportExport, AuditLog or
  MemberPortalAccount tables/models.
- Worktree 2 uses the Phase 3 Worktree 2 sequence range
  `200000`–`299999`; Worktree 3 uses `300000`–`399999`; integration uses
  `900000`–`999999`. Choose unused timestamps after the existing files.
- Worktree 1 may add a MemberPortal-specific migration only when required and
  must use an unused presentation/integration-assigned sequence agreed before
  creation.

### 14.5 General rules

- No unrelated refactoring, directory renaming or architecture replacement.
- No repository-wide formatting.
- No duplicate services, types, components or models.
- No changes to another worktree's owned files.
- No direct notification code in Membership, Billing, Member or Attendance
  controllers.
- No temporary production mocks.
- No silently disabled/flaky tests.
- No weakened authorization to pass tests.
- No blind "ours" or "theirs" conflict resolution.
- No cross-worktree feature cherry-picks during parallel development.
- A necessary shared fix lands in the approved integration branch, then all
  worktrees receive the same small fix.

## 15. Required test coverage

Tests must use tenant A/tenant B and, where relevant, branch A/branch B.
Authorization tests must include owner, permitted staff, unauthorized staff and
member portal identities.

### 15.1 Attendance tests

At minimum:

- valid QR check-in;
- invalid, expired, revoked and tampered QR;
- inactive member;
- missing membership;
- inactive/pending membership;
- expired membership;
- frozen membership;
- suspended membership;
- branch restriction;
- plan restriction;
- visit limit;
- duplicate scan window;
- idempotent same request replay;
- same idempotency key with different payload conflict;
- check-out in supported mode;
- check-out rejected in check-in-only mode;
- manager override permission and mandatory reason;
- attendance correction/reversal and immutable history;
- actor/device attribution;
- tenant isolation;
- branch isolation;
- cross-tenant route-model binding protection;
- rate limiting and safe reason;
- event dispatch only after commit;
- safe event payload; and
- live present count/history pagination.

### 15.2 Notification tests

At minimum:

- template create/update/delete authorization and validation;
- safe preview and variable allow-listing;
- rule create/update and event mapping;
- each required domain-event listener;
- Billing outbox event bridge;
- in-app notification;
- email queueing;
- SMS/WhatsApp unconfigured adapter behavior;
- retry backoff and maximum attempts;
- failed delivery and failed-job recording;
- idempotent duplicate event/delivery;
- manual announcement;
- audience filtering;
- scheduled notification;
- cancellation before dispatch and rejection after dispatch;
- member preferences;
- unread count;
- mark one/all read with recipient ownership;
- tenant isolation;
- branch isolation; and
- queue payload secret/sensitive-data safety.

### 15.3 Report and export tests

At minimum:

- date filter validation and maximum range;
- branch filter and accessible-branch scope;
- plan, member-status and payment-method filters;
- report permission checks;
- tenant isolation;
- bounded pagination;
- financial reconciliation against invoices/payments/refunds;
- attendance aggregation;
- peak-hour boundary/timezone behavior;
- branch performance;
- large asynchronous export;
- protected owner/admin download;
- unauthorized/cross-tenant download denial;
- export expiration and cleanup;
- failed export/retry;
- private path non-disclosure;
- print-friendly response;
- export audit events; and
- representative aggregation query/performance assertions.

### 15.4 Audit tests

At minimum:

- audit creation for high-value actions;
- actor/entity/branch/date filters;
- before-and-after values;
- tenant isolation;
- branch scope;
- permission protection;
- append-only update/delete rejection;
- recursive sensitive-value redaction;
- export creation/download audit events; and
- support-access context.

### 15.5 Member portal tests

At minimum:

- member-only authorization;
- portal account active/suspended behavior;
- member ownership;
- QR-card visibility and token-hash non-disclosure;
- membership details;
- payments and receipts;
- attendance history;
- notifications/read actions;
- expired-membership state;
- frozen/suspended state;
- cross-member and cross-tenant data protection;
- nested receipt/notification IDOR; and
- admin-only field exclusion.

### 15.6 Presentation tests

At minimum:

- loading, empty, error and permission-denied states;
- typed API adapter behavior;
- filters and pagination;
- export status/download-ready state;
- sidebar parent/child permission filtering;
- no duplicate Phase 1/2/3 links;
- member/admin navigation separation;
- responsive scanner/portal/report layouts;
- mobile sidebar; and
- collapsed sidebar.

## 16. Validation commands

Use only scripts that exist on the approved baseline. The inspected repository
supports:

```powershell
php artisan test
composer test
composer run lint:check
composer run types:check
npm run lint:check
npm run format:check
npm run types:check
npm run test
npm run build
```

Also use targeted commands during development, for example:

```powershell
php artisan test tests/Feature/Attendance
php artisan test tests/Feature/Notification
npm run test -- attendance
```

Before handoff, run the full relevant backend/frontend suite and production
build. Integration then runs:

- a fresh migration/seed test database;
- the full backend and frontend suites;
- TypeScript and Larastan checks;
- production build;
- regression for Phase 1/2;
- two-tenant/two-branch security scenarios;
- performance tests for scan/report/export hot paths; and
- recovery tests for queue restart, failed deliveries, failed exports and
  scheduler reruns.

Do not run a formatter that rewrites the entire repository. Limit formatting
to owned files.

## 17. Agent workflow and commit requirements

Each agent must:

1. read this entire document;
2. confirm its directory, branch, status and baseline commit;
3. confirm its role matches section 18;
4. inspect the existing implementation in its owned module;
5. create an internal implementation checklist;
6. work only inside assigned ownership;
7. reuse contracts, models, services, components and schema;
8. add tests with every important business rule;
9. run relevant validations continuously;
10. keep commits small and logical;
11. document integration needs immediately;
12. review all changed files before every commit; and
13. provide the exact handoff in section 20.

Before every commit:

```powershell
git status
git diff --name-only
git diff
```

Then stage only reviewed, owned files:

```powershell
git add path/to/reviewed-file
git diff --cached --name-only
git diff --cached
```

Do not use `git add .` until every changed file is reviewed and confirmed to be
owned.

Suggested logical commit boundaries:

- contracts/types;
- additive schema/models;
- core service/actions and domain events;
- API requests/resources/controllers/routes;
- queue jobs/listeners/scheduler integration note;
- policies/permissions;
- frontend API/types;
- pages/components;
- tests; and
- dependency change alone, if approved.

## 18. Role detection

Determine role from both directory and branch:

| Worktree directory | Branch | Role |
| --- | --- | --- |
| `gms-p3-codex` | `phase-3/presentation` | Codex presentation workstream |
| `gms-p3-claude-work` | `phase-3/attendance` | Claude Work attendance workstream |
| `gms-p3-claude-janidu` | `phase-3/notifications-reports` | Claude Janidu notifications, reports, exports and audit workstream |

PowerShell check:

```powershell
$directoryName = Split-Path -Leaf (Get-Location)
$currentBranch = git branch --show-current
Write-Host "Directory: $directoryName"
Write-Host "Branch: $currentBranch"
```

If the branch does not match one of the three rows:

- create/update only this planning document if assigned;
- document guarded worktree setup;
- do not implement any Phase 3 workstream.

For the checkout used to create this plan, the detected role is:

```text
Directory: GMSv1
Branch: dev
Role: No Phase 3 workstream assigned
Decision: Planning document only; application implementation prohibited here
```

## 19. Merge and integration workflow

### 19.1 Pre-handoff update

Before final push:

```powershell
git status
git fetch origin
git rebase origin/dev
```

Resolve only conflicts in the worktree's owned files. For a shared or another
owner's file, stop, abort/leave the conflict unresolved as appropriate, and
report it to the integration owner. Never blindly choose all ours/theirs.

After rebase:

```powershell
php artisan test
npm run lint:check
npm run types:check
npm run test
npm run build
git status
git push -u origin HEAD
```

Run only applicable commands if the branch has no relevant frontend/backend
changes, but document every omission.

### 19.2 Required merge order

Use the SRS-defined order:

```text
1. phase-3/presentation
2. phase-3/attendance
3. phase-3/notifications-reports
4. Connect domain events to notifications
5. Connect report APIs to the operational dashboard and report pages
6. Add final sidebar routes and permission checks
7. Run full-system regression tests
8. Run security tests
9. Run performance tests
10. Run recovery tests
```

Because the presentation branch may initially contain typed adapters, steps 4
through 6 are mandatory integration work. Remove every temporary mock/fake from
production paths.

### 19.3 Integration checklist

- All three branches started from the approved Phase 2 commit.
- Each branch changed only owned files or documented narrow exceptions.
- Migrations are additive, uniquely named and run on a fresh database.
- Module route files are auto-discovered.
- Providers/listeners/scheduled jobs are registered once.
- Required events are published after commit and consumed idempotently.
- Billing event types bridge to notifications without controller changes.
- Dashboard/report pages use Worktree 3 APIs and Attendance APIs.
- Member portal endpoints enforce server-resolved ownership.
- Permission catalogue/system roles include exact handed-off slugs.
- Sidebar uses exact routes and hides unauthorized items.
- Generated Wayfinder files are regenerated once after all routes merge.
- No dependency/lockfile conflicts remain.
- No mocks, debug output, credentials or sensitive fixtures remain.
- All validations in section 16 pass.

## 20. Required structured handoff

Every agent must finish with exactly this structure:

```text
Agent:
Worktree:
Branch:

Summary:

Completed features:

Files changed:

Files intentionally not changed:

Routes added:

Route names:

API endpoints:

Database migrations:

Contracts implemented:

Permissions:

Domain events published:

Domain events consumed:

Events and listeners:

Queue jobs:

Scheduled jobs:

Sidebar entries required:

Environment variables:

Tests added:

Commands executed:

Test results:

Manual verification:

Security checks:

Known limitations:

Integration requirements:

Potential conflict files:

Recommended next step:
```

Use repository-relative paths and exact route/permission/event class names.
List every command actually run and distinguish passing, failing and skipped
checks.

## 21. Phase 3 completion criteria

Phase 3 is complete only when:

- staff can scan secure member QR codes using a phone camera;
- secure QR identifiers are generated, stored safely and can be revoked;
- invalid memberships are rejected with clear safe reasons;
- duplicate scans do not create duplicate attendance;
- attendance requests are idempotent;
- managers can perform permission-controlled, reasoned, audited overrides;
- corrections/reversals are controlled, append-only and audited;
- check-in-only and check-in/check-out modes work;
- live present-member data is accurate;
- Attendance history is tenant/branch/member scoped;
- expiry and payment notifications are queued from domain events;
- failed notifications retry and record terminal failure correctly;
- template and rule CRUD is authorized and validated;
- manual announcements can be filtered, scheduled and cancelled before
  dispatch;
- member communication preferences are honored;
- unread/read notification actions enforce ownership;
- operational reports reconcile with source records;
- financial reports reconcile with Billing records;
- report filters/pagination are validated and bounded;
- large exports run asynchronously;
- export downloads are private, authorized and auditable;
- expired exports become unavailable and their files are cleaned up;
- audit logs cover sensitive/high-value actions;
- audit records are append-only and sensitive values are redacted;
- members can access their own QR card;
- members can access their own membership details;
- members can access their own payments and receipts;
- members can access their own attendance history;
- members can access their own notifications;
- admin-only/cross-member data is not exposed;
- all Phase 3 pages use exact permission-aware sidebar/navigation entries;
- mobile and collapsed navigation continue to work;
- tenant, gym, branch and member isolation tests pass;
- security tests pass;
- performance tests pass;
- recovery tests pass;
- Phase 1 and Phase 2 regression tests pass;
- all available SRS acceptance scenarios pass; and
- all required tests, static checks and builds pass.

## 22. Planning completion decision

This plan is complete, but Phase 3 implementation and worktree creation are
not authorized from the inspected checkout because:

1. it is on `dev`, not one of the Phase 3 branches;
2. the current checkout contains uncommitted user changes; and
3. the required Phase 3 worktree directories/branches must be created only
   after the approved Phase 2 baseline is established.

The next safe action is for the integration lead to complete section 3, then
run the guarded commands in section 4 and start each agent in its own verified
PowerShell terminal.
