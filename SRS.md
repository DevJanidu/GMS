# Appendix B — Three-Phase Parallel Development Plan

## B.1 Development Strategy

The Gym Management System shall be developed using three parallel Git worktrees.

Each phase will contain three independent workstreams:

1. **Worktree 1 — Application Shell and Dashboard**
2. **Worktree 2 — Business Module Group A**
3. **Worktree 3 — Business Module Group B**

All three worktrees shall start from the same approved `develop` branch commit.

At the end of each phase:

1. All worktrees must complete their automated tests.
2. The branches must be merged into `develop`.
3. Integration and end-to-end testing must be completed.
4. The next phase worktrees must be recreated or rebased from the newly merged `develop` branch.

This prevents later phases from being built on outdated code.

---

# B.2 Initial Foundation Commit

Before creating the three worktrees, one foundation commit must be completed on the `develop` branch.

This is not a separate development phase. It is the common starting point required for parallel development.

## Foundation requirements

The foundation commit shall include:

* Laravel 13 project structure.
* React, Tailwind CSS and shadcn/ui configuration.
* MySQL connection and environment configuration.
* Laravel authentication foundation.
* Tenant identification middleware.
* Branch context middleware.
* Base API response structure.
* API version prefix such as `/api/v1`.
* Global exception handling.
* Permission-checking foundation.
* Shared frontend API client.
* React Query or equivalent server-state setup.
* Shared TypeScript types.
* Module route auto-loading.
* Module navigation auto-loading.
* Base test configuration.
* Shared status constants.
* Shared pagination format.
* Shared validation error format.

## Initial database tables

The foundation commit should create only the tables required by every worktree:

* `tenants`
* `users`
* `branches`
* `roles`
* `permissions`
* `role_user`
* `permission_role`
* `user_branch`
* `personal_access_tokens`
* `jobs`
* `failed_jobs`
* `cache`
* `sessions`

The complete Branch, Staff and Role CRUD implementations will still be completed during Phase 1.

---

# B.3 Required Modular Project Structure

## Laravel backend structure

```text
app/
├── Modules/
│   ├── Gym/
│   ├── Branch/
│   ├── Staff/
│   ├── AccessControl/
│   ├── Member/
│   ├── Plan/
│   ├── Membership/
│   ├── Billing/
│   ├── Attendance/
│   ├── Notification/
│   ├── Report/
│   └── MemberPortal/
│
├── Shared/
│   ├── Contracts/
│   ├── DTOs/
│   ├── Enums/
│   ├── Events/
│   ├── Exceptions/
│   ├── Services/
│   └── Support/
│
└── Tenancy/
    ├── Middleware/
    ├── Scopes/
    └── Services/
```

Each Laravel module should contain its own resources.

```text
Member/
├── Controllers/
├── Models/
├── Policies/
├── Requests/
├── Resources/
├── Services/
├── Actions/
├── Queries/
├── Events/
├── Listeners/
├── Tests/
└── routes.php
```

## React frontend structure

```text
frontend/src/
├── app/
│   ├── layouts/
│   ├── providers/
│   ├── router/
│   └── store/
│
├── components/
│   └── shared/
│
├── modules/
│   ├── dashboard/
│   ├── branches/
│   ├── staff/
│   ├── roles/
│   ├── members/
│   ├── plans/
│   ├── memberships/
│   ├── billing/
│   ├── attendance/
│   ├── renewals/
│   ├── notifications/
│   ├── reports/
│   └── member-portal/
│
└── lib/
    ├── api/
    ├── auth/
    ├── permissions/
    └── utilities/
```

Every frontend module should contain its own routes and navigation metadata.

```text
members/
├── api/
├── components/
├── hooks/
├── pages/
├── schemas/
├── types/
├── routes.tsx
└── navigation.ts
```

The application shell shall automatically load module routes and navigation definitions. Developers should not repeatedly edit one central router or sidebar file.

---

# B.4 Phase 1 — Foundation and Master Data

## Phase 1 objective

Deliver a usable administration foundation where gym owners can sign in and manage branches, staff, permissions, members and membership plans.

---

## Worktree 1 — Application Shell, Dashboard and Sidebar

### Branch

```text
phase-1/ui-shell
```

### Responsibilities

Worktree 1 shall build:

* Main application layout.
* Desktop sidebar.
* Mobile navigation drawer.
* Header and top navigation.
* Tenant and branch selector.
* User account dropdown.
* Notification icon placeholder.
* Permission-aware navigation.
* Protected route component.
* Breadcrumbs.
* Page title system.
* Global search placeholder.
* Dashboard page layout.
* Dashboard statistic card components.
* Dashboard chart containers.
* Loading skeletons.
* Empty states.
* Error states.
* Confirmation dialog.
* Reusable status badge.
* Reusable DataTable foundation.
* Reusable form page layout.
* Responsive layout.
* Light and dark mode support where required.

### Dashboard placeholders

The first dashboard version shall display placeholder or mock data for:

* Active members.
* New members.
* Today’s attendance.
* Expiring memberships.
* Monthly revenue.
* Outstanding balances.
* Recent payments.
* Branch comparison.
* Recent activity.
* System alerts.

### Worktree 1 must not implement

* Branch business logic.
* Staff business logic.
* Member CRUD.
* Plan CRUD.
* Billing.
* Attendance.
* Membership renewal logic.

### Owned files

```text
frontend/src/app/**
frontend/src/components/shared/**
frontend/src/modules/dashboard/**
frontend/src/lib/api/**
frontend/src/lib/auth/**
frontend/src/lib/permissions/**
frontend/src/styles/**
```

Only Worktree 1 may modify shared layouts, global styles, route loaders, shared UI components and frontend application providers.

---

## Worktree 2 — Gym, Branch, Staff and Permission CRUD

### Branch

```text
phase-1/gym-staff-crud
```

### Modules

* Gym settings.
* Branch management.
* Staff management.
* Roles.
* Permissions.
* Staff-to-branch assignments.

### Backend requirements

Worktree 2 shall implement:

* Gym profile APIs.
* Branch CRUD APIs.
* Staff CRUD APIs.
* Staff invitation workflow.
* Staff activation and suspension.
* Staff branch assignment.
* Default roles.
* Custom role CRUD.
* Permission assignment.
* Policy-based API authorization.
* Branch-level access restrictions.
* Session revocation for suspended staff.
* Audit events for role and permission changes.

### Frontend pages

* Gym settings page.
* Branch list page.
* Create branch page.
* Edit branch page.
* Branch details page.
* Branch opening-hours editor.
* Staff list page.
* Create staff page.
* Edit staff page.
* Staff details page.
* Role list page.
* Create role page.
* Edit role page.
* Permission matrix page.
* Staff branch-assignment page.

### SRS coverage

* GBM-001 through GBM-010.
* STF-001 through STF-012.
* Relevant SYS authentication and authorization requirements.

### Owned files

```text
app/Modules/Gym/**
app/Modules/Branch/**
app/Modules/Staff/**
app/Modules/AccessControl/**

frontend/src/modules/branches/**
frontend/src/modules/staff/**
frontend/src/modules/roles/**
frontend/src/modules/settings/gym/**
```

---

## Worktree 3 — Member and Membership Plan CRUD

### Branch

```text
phase-1/member-plan-crud
```

### Modules

* Member management.
* Member documents.
* Member search.
* Membership plans.
* Plan branch availability.

### Backend requirements

Worktree 3 shall implement:

* Member CRUD APIs.
* Tenant-scoped member-number generation.
* Duplicate-member detection.
* Member photo handling.
* Member document handling.
* Member status management.
* Member archiving.
* Member search.
* Plan CRUD APIs.
* Plan pricing.
* Plan duration rules.
* Plan branch restrictions.
* Plan access rules.
* Plan cloning.
* Plan activation and deactivation.
* Historical price protection.

### Frontend pages

* Member list page.
* Register member page.
* Edit member page.
* Member profile page.
* Member overview tab.
* Member document tab.
* Member history placeholders.
* Plan list page.
* Create plan page.
* Edit plan page.
* Plan details page.
* Plan branch-availability page.
* Plan pricing and access-rule page.

### SRS coverage

* MEM-001 through MEM-012.
* PLN-001 through PLN-010.

### Owned files

```text
app/Modules/Member/**
app/Modules/Plan/**

frontend/src/modules/members/**
frontend/src/modules/plans/**
```

---

## Phase 1 completion criteria

Phase 1 is complete when:

* Users can log in securely.
* Tenant and branch contexts are enforced.
* The sidebar changes according to permissions.
* Gym details can be configured.
* Branches can be fully managed.
* Staff members can be fully managed.
* Roles and permissions can be fully managed.
* Members can be registered and managed.
* Membership plans can be created and assigned to branches.
* Cross-tenant access tests pass.
* All Phase 1 APIs have automated feature tests.
* All Phase 1 pages have loading, empty, success and error states.

## Phase 1 merge order

```text
1. phase-1/ui-shell
2. phase-1/gym-staff-crud
3. phase-1/member-plan-crud
4. Integration fixes
5. Phase 1 end-to-end testing
```

After Phase 1, all three branches must be merged into `develop`.

---

# B.5 Phase 2 — Membership Lifecycle and Billing

## Phase 2 objective

Deliver the complete commercial member lifecycle, including membership sales, invoices, payments, renewals, expiry, freezes, suspensions, cancellations and refunds.

Before starting Phase 2, all worktrees shall be recreated from the completed Phase 1 `develop` branch.

---

## Phase 2 shared contracts

Before parallel work begins, the following interfaces shall be committed to `develop`:

```text
MembershipPriceCalculator
MembershipDateCalculator
InvoiceCreator
PaymentRecorder
MembershipAccessChecker
ReceiptGenerator
MembershipRenewalContract
```

The following events shall also be defined:

```text
MembershipCreated
MembershipActivated
MembershipRenewed
MembershipFrozen
MembershipSuspended
MembershipCancelled
InvoiceCreated
PaymentCompleted
PaymentRefunded
MembershipExpiring
MembershipExpired
```

These contracts prevent one worktree from directly changing another worktree’s internal implementation.

---

## Worktree 1 — Live Dashboard and Shared Workflow Components

### Branch

```text
phase-2/dashboard-integration
```

### Responsibilities

Worktree 1 shall connect the dashboard to real APIs.

It shall implement:

* Active-member widget.
* New-member widget.
* Expiring-membership widget.
* Expired-member widget.
* Revenue widget.
* Outstanding-balance widget.
* Recent-payment table.
* Renewal summary.
* Branch comparison.
* Date-range filters.
* Branch filters.
* Dashboard loading states.
* Dashboard permission restrictions.
* Drill-down links from dashboard cards.

### Shared components

Worktree 1 may also improve:

* DataTable.
* Date-range picker.
* Currency display.
* Money input.
* Branch filter.
* Status badges.
* Activity timeline.
* Permission guard.
* Reusable details-page layout.

Worktree 1 must consume published APIs and must not implement membership or billing business logic.

---

## Worktree 2 — Memberships, Renewals and Expiry

### Branch

```text
phase-2/membership-lifecycle
```

### Modules

* Membership sales.
* Membership history.
* Membership status.
* Renewal.
* Expiry.
* Freeze.
* Suspension.
* Cancellation.
* Reactivation.

### Backend requirements

* Sell a membership to an existing member.
* Calculate membership start and expiry dates.
* Preserve plan and price snapshots.
* Support immediate and future start dates.
* Link renewed memberships.
* Support early renewal.
* Freeze memberships.
* Suspend memberships.
* Cancel memberships.
* Reactivate eligible memberships.
* Apply grace-period rules.
* Run the daily expiry scheduler.
* Detect expiring memberships.
* Detect expired memberships.
* Publish membership domain events.
* Maintain complete membership-event history.
* Prevent destructive deletion of historical memberships.

### Frontend pages

* Membership list.
* Membership details.
* Sell membership workflow.
* Membership price summary.
* Membership history timeline.
* Renew membership page.
* Freeze membership dialog.
* Suspend membership dialog.
* Cancel membership dialog.
* Reactivate membership dialog.
* Expiring-soon page.
* Expired-membership page.
* Grace-period page.
* Renewal dashboard.
* Bulk reminder selection screen.

### SRS coverage

* REN-001 through REN-012.
* Membership-related portions of member workflows.
* Membership status and history requirements.

### Owned files

```text
app/Modules/Membership/**
frontend/src/modules/memberships/**
frontend/src/modules/renewals/**
```

---

## Worktree 3 — Invoices, Payments, Receipts and Refunds

### Branch

```text
phase-2/billing-payments
```

### Modules

* Invoices.
* Invoice items.
* Payments.
* Receipts.
* Refunds.
* Outstanding balances.
* Daily collections.

### Backend requirements

* Create invoices.
* Create invoice items.
* Calculate subtotal.
* Calculate fixed and percentage discounts.
* Calculate tax.
* Calculate joining fees.
* Calculate grand total.
* Track amount paid and balance.
* Record cash payments.
* Record card payments.
* Record bank-transfer payments.
* Record online payments.
* Support partial payments.
* Support split payments.
* Support installment payments.
* Generate receipts.
* Void invoices with permission.
* Process full and partial refunds.
* Maintain immutable payment history.
* Implement payment idempotency.
* Publish billing events.
* Generate daily collection summaries.

### Frontend pages

* Invoice list.
* Invoice details.
* Create invoice page.
* Payment page or modal.
* Receipt page.
* Printable receipt.
* Payment history.
* Refund workflow.
* Refund details.
* Outstanding balances.
* Daily collection report.
* Cashier collection summary.

### SRS coverage

* BIL-001 through BIL-014.
* Refund and reversal workflow.
* Payment receipt requirements.

### Owned files

```text
app/Modules/Billing/**
frontend/src/modules/billing/**
```

---

## Membership and billing integration rule

Worktree 2 must not directly create invoice database records.

It shall call the shared `InvoiceCreator` contract.

Worktree 3 shall implement the `InvoiceCreator` contract.

The final membership-sale orchestration shall execute inside one database transaction:

```text
1. Validate member.
2. Validate plan.
3. Calculate membership dates.
4. Create membership.
5. Create invoice through InvoiceCreator.
6. Record optional initial payment.
7. Generate receipt.
8. Activate membership when rules are satisfied.
9. Commit transaction.
10. Publish events after commit.
```

During parallel development:

* Worktree 2 shall use a fake `InvoiceCreator`.
* Worktree 3 shall test its real `InvoiceCreator` implementation independently.
* The real implementation shall be bound during the Phase 2 integration merge.

---

## Phase 2 completion criteria

Phase 2 is complete when:

* A member can purchase a membership.
* The system generates the correct invoice.
* Full and partial payments work.
* Receipts can be printed and downloaded.
* Memberships can be renewed.
* Early renewal does not remove paid days.
* Memberships can be frozen, suspended and cancelled.
* Expiry automation updates membership statuses.
* Refunds preserve the original payment.
* Dashboard values match membership and financial records.
* Financial operations are transactional and idempotent.
* Phase 2 end-to-end tests pass.

## Phase 2 merge order

```text
1. phase-2/dashboard-integration
2. phase-2/membership-lifecycle
3. phase-2/billing-payments
4. Bind shared billing and membership contracts
5. Run membership-sale integration tests
6. Run Phase 2 end-to-end tests
```

---

# B.6 Phase 3 — Attendance, Notifications, Reports and Member Portal

## Phase 3 objective

Complete the operational platform with QR attendance, automated notifications, reports, exports, audit functions and the member self-service portal.

Before starting Phase 3, all worktrees shall be recreated from the completed Phase 2 `develop` branch.

---

## Phase 3 shared contracts

The following contracts shall be defined before parallel work begins:

```text
MembershipAccessChecker
AttendanceRecorder
NotificationDispatcher
NotificationTemplateRenderer
ReportQuery
ExportGenerator
MemberPortalAuthorizer
```

The following domain events shall already be available:

```text
MemberRegistered
MembershipActivated
MembershipExpiring
MembershipExpired
MembershipRenewed
PaymentCompleted
PaymentRefunded
AttendanceCheckedIn
AttendanceRejected
```

Notification modules must listen to these events instead of modifying membership, billing or attendance controllers.

---

## Worktree 1 — Operational Dashboard, Reports UI and Member Portal UI

### Branch

```text
phase-3/presentation
```

### Responsibilities

Worktree 1 shall implement presentation-layer features only.

### Operational dashboard

* Today’s attendance.
* Current present-member count.
* Peak attendance periods.
* Expiring memberships.
* Failed notifications.
* Outstanding balances.
* Branch-performance comparison.
* Renewal conversion.
* Recent system activity.

### Reports interface

* Report catalogue.
* Report filter panel.
* Date-range selection.
* Branch selection.
* Plan filter.
* Member-status filter.
* Payment-method filter.
* KPI cards.
* Charts.
* Drill-down tables.
* Export-status interface.
* Download-ready notification.
* Print-friendly report layout.

### Notification interface

* Notification center.
* Unread counter.
* Notification list.
* Read/unread actions.
* Notification details.
* Failed-notification indicators.

### Member portal interface

* Member portal layout.
* Member dashboard.
* Member profile.
* QR membership card.
* Active-membership details.
* Expiry date.
* Payment history.
* Receipt list.
* Attendance history.
* Notifications.
* Mobile-responsive portal navigation.

### Owned files

```text
frontend/src/modules/dashboard/**
frontend/src/modules/reports/**
frontend/src/modules/member-portal/**
frontend/src/modules/notifications/components/**
frontend/src/modules/notifications/pages/member-notifications/**
```

Worktree 1 must not modify notification delivery, report query or attendance business logic.

---

## Worktree 2 — Attendance Module

### Branch

```text
phase-3/attendance
```

### Backend requirements

* Generate secure member QR identifiers.
* Validate QR attendance requests.
* Check tenant context.
* Check branch context.
* Check member status.
* Check active membership.
* Check membership expiry.
* Check freeze and suspension.
* Check plan access rules.
* Check branch access.
* Check visit limits.
* Check duplicate scan window.
* Record phone-camera attendance.
* Record manual attendance.
* Support check-in-only mode.
* Support check-in/check-out mode.
* Allow controlled manager override.
* Record device and staff information.
* Correct attendance using reversal or controlled edits.
* Provide live present-member query.
* Provide attendance-history APIs.
* Provide recent scan results.
* Rate-limit scan endpoints.
* Implement idempotency for duplicate requests.

### Frontend pages

* Mobile QR scan page.
* Camera permission state.
* Successful scan state.
* Rejected scan state.
* Manual member search.
* Manual check-in.
* Live attendance page.
* Present-member list.
* Attendance history.
* Attendance details.
* Attendance correction page.
* Manager override dialog.
* Branch attendance settings.

### SRS coverage

* ATT-001 through ATT-014.
* Phone-based attendance workflow.
* Attendance-related acceptance scenarios.

### Owned files

```text
app/Modules/Attendance/**
frontend/src/modules/attendance/**
```

---

## Worktree 3 — Notifications, Reports, Exports and Audit

### Branch

```text
phase-3/notifications-reports
```

### Notification module

Worktree 3 shall implement:

* Notification-template CRUD.
* Notification-rule CRUD.
* Email notification channel.
* SMS adapter interface.
* WhatsApp adapter interface.
* In-app notifications.
* Notification logs.
* Delivery-status tracking.
* Retry handling.
* Failed-job handling.
* Idempotency protection.
* Manual announcements.
* Audience filters.
* Scheduled notifications.
* Member communication preferences.
* Notification preview.
* Notification cancellation before dispatch.

### Reports module

Worktree 3 shall implement:

* Executive dashboard APIs.
* Membership summary report.
* New membership sales report.
* Renewal report.
* Expiry report.
* Attendance daily report.
* Peak-hours report.
* Member-frequency report.
* Sales report.
* Collections report.
* Outstanding-balance report.
* Refund report.
* Staff-activity report.
* Notification-delivery report.
* Branch-performance report.
* CSV export.
* Print-friendly data endpoint.
* Asynchronous large exports.
* Export expiry.
* Permission-controlled report access.

### Audit module

Worktree 3 shall implement:

* Searchable audit log.
* Audit filters.
* Actor filter.
* Entity filter.
* Date filter.
* Branch filter.
* Before-and-after values.
* Export audit events.
* Support-access audit context.
* Redaction of secrets and sensitive fields.

### Frontend pages

* Notification-template list.
* Create notification template.
* Edit notification template.
* Notification rules.
* Notification logs.
* Manual announcement page.
* Report backend integration.
* Export history.
* Export download.
* Audit log list.
* Audit log details.

### SRS coverage

* NOT-001 through NOT-012.
* RPT-001 through RPT-012.
* SYS-005.
* Reporting catalogue requirements.
* Audit requirements.

### Owned files

```text
app/Modules/Notification/**
app/Modules/Report/**
app/Modules/Audit/**

frontend/src/modules/notifications/**
frontend/src/modules/reports/api/**
frontend/src/modules/exports/**
frontend/src/modules/audit/**
```

---

## Phase 3 completion criteria

Phase 3 is complete when:

* Staff can scan member QR codes using a phone camera.
* Invalid memberships are rejected with clear reasons.
* Duplicate scans do not create duplicate attendance.
* Managers can perform audited overrides.
* Expiry and payment notifications are queued.
* Failed notifications retry correctly.
* Notification templates and rules can be managed.
* Operational and financial reports reconcile with source records.
* Large exports run asynchronously.
* Audit logs cover sensitive actions.
* Members can access their QR, membership, payments, receipts and attendance.
* Security, performance and recovery tests pass.
* All minimum acceptance scenarios in the SRS pass.

## Phase 3 merge order

```text
1. phase-3/presentation
2. phase-3/attendance
3. phase-3/notifications-reports
4. Connect domain events to notifications
5. Connect report APIs to dashboard and report pages
6. Run full-system regression tests
7. Run security and performance tests
```

---

# B.7 Rules That Prevent Worktree Conflicts

## Rule 1 — One module has one owner per phase

No two worktrees may modify the same backend or frontend module during the same phase.

For example:

```text
app/Modules/Billing/**
```

must belong to only one worktree during that phase.

---

## Rule 2 — Shared files belong to Worktree 1

The following files and directories shall normally be owned by Worktree 1:

```text
frontend/src/app/**
frontend/src/components/shared/**
frontend/src/styles/**
frontend/src/lib/api/**
frontend/src/lib/auth/**
package.json
vite.config.*
tailwind.config.*
components.json
```

Other worktrees shall not directly modify these files.

When another worktree requires a shared change, it shall record the change in:

```text
INTEGRATION_NOTES.md
```

Worktree 1 or the integration merge shall apply the change.

---

## Rule 3 — Do not share one central route file

Backend modules shall define their own route files:

```text
app/Modules/Member/routes.php
app/Modules/Billing/routes.php
app/Modules/Attendance/routes.php
```

The main application shall automatically load module routes.

Frontend modules shall also export their own routes:

```text
frontend/src/modules/members/routes.tsx
frontend/src/modules/billing/routes.tsx
frontend/src/modules/attendance/routes.tsx
```

Developers shall not repeatedly edit a single large `App.tsx`, `router.tsx` or `api.php`.

---

## Rule 4 — Sidebar items must come from modules

Each frontend module shall provide its own navigation definition.

```typescript
export const navigation = {
  label: "Members",
  path: "/members",
  permission: "members.view",
  order: 30,
};
```

The main sidebar shall load these definitions automatically.

This prevents every worktree from editing the sidebar component.

---

## Rule 5 — Use contracts between modules

One module shall not directly depend on the internal service or controller of another module.

Use contracts such as:

```php
interface InvoiceCreator
{
    public function createForMembership(
        MembershipInvoiceData $data
    ): InvoiceResult;
}
```

The consuming module depends on the interface.

The providing module implements the interface.

---

## Rule 6 — Use domain events for notifications and reports

Modules shall publish events such as:

```text
MemberRegistered
MembershipActivated
PaymentCompleted
MembershipExpired
AttendanceCheckedIn
```

Notification and reporting modules shall listen to these events.

They must not modify another module’s controller merely to add notification logic.

---

## Rule 7 — Do not modify another module’s migrations

Every database table shall have one owning module.

Examples:

| Table                | Owner               |
| -------------------- | ------------------- |
| `members`            | Member module       |
| `plans`              | Plan module         |
| `memberships`        | Membership module   |
| `invoices`           | Billing module      |
| `payments`           | Billing module      |
| `attendance_records` | Attendance module   |
| `notifications`      | Notification module |

When a new column is needed, the owning module creates the migration.

---

## Rule 8 — Use migration number ranges

To reduce migration filename collisions, each worktree shall use an assigned sequence.

```text
Worktree 1: 100000–199999
Worktree 2: 200000–299999
Worktree 3: 300000–399999
Integration: 900000–999999
```

Example:

```text
2026_07_23_200001_create_memberships_table.php
2026_07_23_300001_create_invoices_table.php
```

Migration order must still respect foreign-key dependencies.

---

## Rule 9 — Do not run global formatting from feature branches

Developers shall not run formatting commands that rewrite the entire repository.

Formatting shall be limited to files owned by the current worktree.

Avoid:

```bash
prettier --write .
```

Prefer:

```bash
prettier --write frontend/src/modules/members
```

---

## Rule 10 — No direct cross-worktree cherry-picking during a phase

All worktrees should remain based on the same phase-start commit.

Urgent shared fixes should be:

1. Applied to `develop`.
2. Committed as a small shared fix.
3. Cherry-picked into all three worktrees.

A feature commit from one worktree should not be cherry-picked into only one other worktree because this creates inconsistent histories.

---

# B.8 Git Worktree Commands

## Create Phase 1 worktrees

```bash
git checkout develop
git pull origin develop

git worktree add ../gym-ui-shell \
  -b phase-1/ui-shell develop

git worktree add ../gym-core-crud \
  -b phase-1/gym-staff-crud develop

git worktree add ../gym-member-crud \
  -b phase-1/member-plan-crud develop
```

## Review active worktrees

```bash
git worktree list
```

## Merge completed Phase 1 branches

```bash
git checkout develop

git merge --no-ff phase-1/ui-shell
git merge --no-ff phase-1/gym-staff-crud
git merge --no-ff phase-1/member-plan-crud

php artisan migrate:fresh --seed
php artisan test
npm run test
npm run build
```

## Remove completed worktrees

```bash
git worktree remove ../gym-ui-shell
git worktree remove ../gym-core-crud
git worktree remove ../gym-member-crud

git worktree prune
```

Phase 2 and Phase 3 worktrees shall then be created from the latest tested `develop` branch.

---

# B.9 Integration Checklist

Before merging each worktree:

* The branch is updated from the phase-start baseline.
* Only assigned module files were changed.
* No unrelated formatting changes exist.
* Database migrations run successfully.
* Seeders run successfully.
* Laravel tests pass.
* Frontend tests pass.
* TypeScript compilation passes.
* Production frontend build passes.
* API permissions are tested.
* Tenant isolation is tested.
* Loading and error states are implemented.
* Mobile responsiveness is checked.
* New API endpoints are documented.
* Cross-module requirements are recorded in `INTEGRATION_NOTES.md`.

After all three branches are merged:

* Run all migrations from a fresh database.
* Run the complete automated test suite.
* Run critical end-to-end workflows.
* Test with at least two tenants.
* Test with at least two branches.
* Test unauthorized API access.
* Verify dashboard calculations.
* Verify audit events.
* Verify queue jobs.
* Verify notification retries.
* Verify no module routes or sidebar items are missing.

---

# B.10 Final Delivery Summary

| Phase   | Worktree 1                                     | Worktree 2                       | Worktree 3                                |
| ------- | ---------------------------------------------- | -------------------------------- | ----------------------------------------- |
| Phase 1 | Dashboard, sidebar and application shell       | Gym, branches, staff and RBAC    | Members and plans                         |
| Phase 2 | Live dashboard and shared workflow UI          | Memberships, renewals and expiry | Billing, payments, receipts and refunds   |
| Phase 3 | Reports UI, notifications UI and member portal | Attendance                       | Notifications, reports, exports and audit |

This division keeps tightly related code together, limits shared-file changes, allows three worktrees to run in parallel and creates a stable integration checkpoint after every phase.
