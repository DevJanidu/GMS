# Database Architecture

This schema is the persistence contract for the three parallel development phases.
It contains no workflow implementation. Business rules belong to their owning
modules and communicate across module boundaries through the shared contracts and
domain events defined in Appendix B.

## Ownership map

| Module | Owned tables |
| --- | --- |
| Foundation | `tenants`, `users`, `branches`, `roles`, `permissions`, `permission_role`, `role_user`, `user_branch`, `personal_access_tokens`, `jobs`, `failed_jobs`, `cache`, `cache_locks`, `sessions`, `password_reset_tokens`, `passkeys` |
| Gym | `gym_profiles` |
| Staff | `staff_profiles` |
| Member | `members`, `member_sequences`, `member_documents` |
| Plan | `plans`, `plan_branch`, `plan_price_histories` |
| Membership | `membership_sequences`, `memberships`, `membership_status_histories`, `membership_freezes` |
| Billing | `invoice_sequences`, `payment_sequences`, `receipt_sequences`, `refund_sequences`, `invoices`, `invoice_items`, `payments`, `payment_allocations`, `installment_schedules`, `refunds`, `receipts`, `payment_events` |
| Attendance | `member_qr_credentials`, `attendance_settings`, `attendance_records`, `attendance_scan_logs`, `attendance_corrections` |
| Notification | `notification_templates`, `notification_rules`, `member_notification_preferences`, `notifications`, `announcements`, `notification_deliveries`, `notification_delivery_attempts` |
| Report | `report_exports` |
| Audit | `audit_logs` |
| Member Portal | `member_portal_accounts` |

## Dependency order

```text
Foundation
├── Gym / Staff / Member / Plan / Member Portal
├── Membership
│   ├── Billing
│   └── Attendance
├── Notification
├── Report
└── Audit
```

Membership rows retain plan, pricing, and access-rule snapshots. Invoices retain
calculated totals, receipts retain printable snapshots, and audit/history tables
retain before-and-after or event data. These records prevent later changes to
plans, prices, payments, or application code from rewriting historical facts.

## Parallel-development constraints

- A table may be changed only by its owning module.
- Cross-module foreign keys target stable aggregate identifiers, not internal
  implementation tables.
- Membership creates billing data only through the `InvoiceCreator` contract.
- Notification and reporting modules consume domain events rather than changing
  source-module controllers.
- Number sequence tables are tenant scoped.
- Request/idempotency keys are tenant scoped and uniquely indexed.
- Financial, attendance, delivery-attempt, and audit histories are append-only at
  the application layer.
- Tenant and frequently filtered status/date columns are indexed.
- Migration prefixes follow the assigned worktree ranges:
  Worktree 1 `100000–199999`, Worktree 2 `200000–299999`, Worktree 3
  `300000–399999`, and integration `900000–999999`.
