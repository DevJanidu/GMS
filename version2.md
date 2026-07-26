# Gym Management System — Version 2 Engineering and Product Audit

*Audit performed against the `dev` branch working tree (commit `e76d6f8` plus uncommitted in-progress changes to Member, Membership, Gym-profile and Billing frontend files present at audit time). Scope excludes `node_modules`, `vendor`, `storage` caches, and compiled assets. No application code was modified to produce this document.*

---

## 1. Executive Summary

GMSv1 is a Laravel 13 + Inertia/React gym management system built across three "phased worktree" iterations (documented in `INTEGRATION_NOTES.md`, `database/ARCHITECTURE.md`, and `SRS.md`). The engineering discipline behind it is genuinely unusual for a project this size: every module has real feature tests, financial ledger tables are append-only and integer-cent, tenant isolation is enforced by a global Eloquent scope applied almost everywhere, and idempotency keys are enforced with real database unique constraints rather than app-only checks. This is not a prototype — most core workflows (member registration, plan configuration, membership sale/renewal/freeze/cancel, invoicing, payment collection, refunds, receipts, QR attendance, reporting) are wired end-to-end from a real form, through a real controller/service/action, into a real database row, and back out to a real UI state.

That said, the system carries the scar tissue of its three-parallel-worktree history. Several integration seams that were explicitly flagged as "temporary/pending" in the project's own documentation have since been fixed (dashboard financial sections, Phase 3 provider registration, permission catalogue gaps, sidebar hardcoding) — but new, undocumented seams have appeared in their place (a fully-built operational-stats API that the dashboard still refuses to call; two fully-built billing report pages that are unreachable from the sidebar because of a dead navigation export). This audit found several defects severe enough to affect revenue integrity directly, not just polish.

**Strongest areas**
- Billing core (`app/Modules/Billing/**`): correct integer-cent math, DB-enforced idempotency, row-locked concurrency protection, immutable ledger rows (`ImmutableLedgerEntry`), and tenant/branch-scoped receipt access with a genuinely tested IDOR case.
- Attendance (`app/Modules/Attendance/**`): defense-in-depth eligibility checks that correctly compensate for a documented weakness in the shared `MembershipAccessChecker` contract, real kiosk scanner UI, rate limiting, and forensic scan logging.
- Member Portal (`app/Modules/MemberPortal/**`): the newest module and the best-tested — its boundary test includes a genuine nested-resource IDOR test and asserts internal fields never leak to the member-facing API.
- Tenant isolation: `BelongsToTenant` + `TenantScope`, combined with a fixed route-model-binding middleware ordering bug, means nearly every tenant-scoped model 404s correctly for cross-tenant access, and this is tested repeatedly across modules.

**Weakest areas**
- **Revenue-integrity logic in Membership**: a membership is activated as `status = active` based purely on start date, independent of whether the invoice was actually paid — the code computes `paid_in_full` and then discards it (`app/Modules/Membership/Actions/SellMembershipAction.php:49,77-79`). Renewals re-charge the plan's one-time joining fee every cycle (`app/Modules/Membership/Services/MembershipBillingOrchestrator.php:47`).
- **Branch-level data isolation is inconsistent and, in several places, effectively absent.** Tenant isolation is solid; branch isolation (a receptionist assigned to Branch A seeing only Branch A's data) is only enforced where a caller *chooses* to pass `branch_id` — Member, Membership, Staff, and Branch listing endpoints all default to tenant-wide visibility.
- **Two notification channels are decorative.** SMS and WhatsApp are selectable in the template editor UI but hard-coded to fail immediately in `DeliverNotificationJob` — no gym gets a real SMS/WhatsApp reminder from this system today.
- **Audit logging covers a narrow slice of the system.** Only Attendance, Staff, Roles, and Notification/Report admin actions call `AuditLogger`. Membership status changes, billing payments/refunds/voids, member edits, and plan price changes are entirely unaudited despite being the highest-stakes mutations in the system.
- **No CI pipeline** despite a `composer.json` `ci:check` script that implies one was intended; no E2E test suite; zero tests exercise real concurrent/parallel requests despite the architecture leaning heavily on row-locking to prevent races.
- **No SaaS/tenant-subscription layer at all** — the `tenants` table has no plan tier, trial, or limit fields, and there is no platform-admin panel. This is a single-deployment multi-tenant app, not yet a sellable SaaS product.

**Main commercial risks**: selling this today means selling a system that can activate a membership without full payment, silently re-bills joining fees on renewal, and advertises SMS/WhatsApp reminders that never send — all financially visible failure modes a paying gym owner would notice within the first billing cycle.

**Main technical risks**: the branch-isolation gap will compound as multi-branch customers onboard (data leaking across a gym's own branches is a trust-breaking bug, not just tech debt); the lack of CI means regressions in the well-built test suite can reach `dev` unnoticed; the dead/duplicate schema (four unused sequence tables, unused `payment_allocations`/`payment_events`/`installment_schedules`, two overlapping membership-history tables with different delete semantics) will actively mislead the next engineer who trusts `database/ARCHITECTURE.md` over the actual code.

**Production readiness**: **Not ready.** The core transactional workflows work, but the payment-gated-activation gap and joining-fee double-charge are launch blockers for any real money handling, and the branch-isolation gaps are launch blockers for any multi-branch customer.

**Ready to sell to gyms**: **Not yet.** Single-branch, single-owner-operator pilots could probably run today with close supervision; anything beyond that (multiple staff roles, multiple branches, SMS reminders as a selling point) would surface the gaps above almost immediately.

**Approximate readiness score: 58 / 100** — a technically competent foundation (would score materially higher on architecture/code-quality alone) pulled down by revenue-correctness bugs, inconsistent branch security, non-functional advertised features, and the complete absence of CI/E2E/concurrency testing and SaaS operability.

---

## 2. Current Technology and Architecture

**Backend**: Laravel 13, PHP, MySQL. Auth via Laravel Fortify (2FA, passkeys via `PasskeyAuthenticatable`, email verification, password reset) layered under Laravel Sanctum for stateful SPA API auth (`statefulApi()` in `bootstrap/app.php`). Static analysis via Larastan (`phpstan.neon`, level 7, scoped to `app/`, `bootstrap/app.php`, `config/`, `database/`, `routes/`); code style via Laravel Pint (`pint.json`).

**Frontend**: Inertia.js (not a standalone SPA) + React + TypeScript, Tailwind CSS, shadcn/ui component primitives on Radix. No client-side data-fetching/cache library (no React Query/SWR/Redux/Zustand present in `package.json`) — state is Inertia props plus `router.reload()`/`useForm()`. Laravel Wayfinder auto-generates typed TS route/action helpers into `resources/js/actions/**` and `resources/js/routes/**` (committed to source control; regeneration produces repo-wide cosmetic diffs, a documented and accepted quirk). Charts use shadcn's chart wrapper over Recharts, per `CLAUDE.md`'s house rule — confirmed followed in the Reports module.

**Module structure — a real inconsistency, not a misunderstanding**: most business modules live under `app/Modules/{Name}/**` with their own `Controllers/Models/Policies/Requests/Resources/Services/Actions/Events/routes.php` (Staff, Branch, Gym, AccessControl, Membership, Billing, Attendance, Notification, Report, Audit, MemberPortal, Dashboard). **Member and Plan deliberately do not** — they live flat under `app/Http/Controllers`, `app/Models`, `app/Policies`, `app/Services`, `app/Http/Requests` because the foundation commit set this precedent before the SRS's `app/Modules/Member`/`app/Modules/Plan` convention was written (documented in `INTEGRATION_NOTES.md`). This is stable and working, but it means two different conventions must be understood by every new contributor.

**Routing auto-loading**: `routes/api.php` auto-discovers every `app/Modules/*/routes.php` via `glob()` under a `/v1` prefix — real, working module API auto-loading. `routes/web.php` now also auto-discovers `app/Modules/*/web.php` (a fix since the original integration notes were written), but still needs 5 manual `require` lines for the flat-convention modules (`settings.php`, `members.php`, `plans.php`, `reports.php`, `notifications.php`).

**Frontend navigation auto-loading**: real and permission-aware — `resources/js/app/navigation.ts` globs every `modules/**/navigation.ts`, sorts by `order`, and filters through `can()`. This supersedes an earlier hardcoded sidebar (confirmed fixed).

**Database**: 36 migration files across ranges assigned per-worktree (`100000-199999`, `200000-299999`, `300000-399999`, integration `900000-999999`). Tenant isolation via a `BelongsToTenant` trait applying a global `TenantScope`, used by 33 of the ~35 models — the two notable exceptions are `User` and `Role`. Money is stored as integer cents throughout Billing with no float/decimal money columns. Multiple append-only ledger tables enforce immutability via Eloquent `updating`/`deleting` hooks — though, per §11, not uniformly.

**Background processing**: Laravel's queue/job system (`DeliverNotificationJob`, `GenerateReportExportJob`, `DispatchAnnouncementJob`) and one scheduled console command (`membership:process-expiry`, daily at 00:30). A second command exists (`reports:expire-exports`) but is **not** scheduled anywhere.

**Testing**: Pest/PHPUnit, 47 Feature test files + 4 Unit test files (263 test cases), plus 21 Vitest frontend test files (mostly shared-component level). No Playwright/E2E suite despite a `.playwright-mcp/` directory (confirmed to be manual debugging session artifacts, not a checked-in test suite). No CI configuration found anywhere in the repository.

---

## 3. Existing Feature Inventory

| Module | Feature | Status | Evidence | Notes |
|---|---|---|---|---|
| Member | Registration (create + validation + duplicate warn) | Complete | `app/Http/Controllers/MemberController.php:70-118`, `tests/Feature/Members/MemberCrudTest.php` | Full round trip, transactional, event dispatched after commit |
| Member | Duplicate detection on create | Complete | `app/Services/Members/DuplicateMemberFinder.php:18-44` | Soft warning + confirm-anyway flow, tenant-scoped |
| Member | Duplicate detection on update | Missing | `MemberController::update` never calls `DuplicateMemberFinder` | Editing email to collide with another member is unchecked |
| Member | Gap-free member numbering | Complete | `app/Services/Members/MemberNumberGenerator.php:16-32` | Row-locked, tenant-scoped, tested |
| Member | Profile photo upload | Complete | `Member::photoUrl()`, tested in `MemberCrudTest` | |
| Member | Document upload/delete | Complete (functionally) / Partial (security) | `app/Http/Controllers/MemberDocumentController.php` | No MIME allow-list; see §9 |
| Member | Emergency contacts | Partial | `members` table flat columns only | Single contact, no relationship/table |
| Member | Health notes / PAR-Q | Missing | grep confirmed absent at every layer | Only a generic 2000-char `notes` field |
| Member | Status change / archive | Complete | `MemberStatusController` | Enum: `active\|inactive\|archived` only |
| Member | Member deletion | Missing | No `DELETE /members/{member}` route exists | `MemberPolicy::delete()` is dead code |
| Member | Branch-scoped visibility | Broken | `MemberController::index()` only filters by `branch_id` if explicitly requested | See §5 |
| Member Portal | Invitation → acceptance → login | Complete | `app/Modules/MemberPortal/Controllers/{MemberPortalInviteController,MemberPortalInvitationController}.php` | Signed URL, real password set, role attached |
| Member Portal | Self-service dashboard/profile/QR/payments/receipts/attendance/notifications | Complete | `MemberPortalController.php`, `MemberPortalBoundaryTest.php` (6 substantive tests incl. IDOR) | Best-tested module in the codebase |
| Plan | CRUD + activation/deactivation | Complete | `app/Http/Controllers/PlanController.php`, `PlanStatusController.php` | |
| Plan | Branch availability restriction | Complete | `plan_branch` pivot, `PlanBranchAvailabilityTest.php` | |
| Plan | Price history append-only ledger | Complete | `app/Observers/PlanObserver.php:15-46` | Genuinely closes/opens rows only on price/fee change |
| Plan | Cloning | Complete | `app/Services/Plans/PlanCloner.php` | |
| Plan | Joining fee | Complete | `plans.joining_fee` | |
| Plan | Discounts / promotional offers / coupons | Missing | Absent from migration, request, resource, and UI | Confirmed at every layer |
| Membership | Sale (`SellMembershipAction`) | Broken (payment gating) | `Actions/SellMembershipAction.php:49,77-79` | See §5, finding B-1 |
| Membership | Renewal (date math) | Complete | `Actions/RenewMembershipAction.php:43-45`, tested | "Never loses paid days" claim verified true |
| Membership | Renewal (joining fee) | Broken | `Services/MembershipBillingOrchestrator.php:47` | Re-charges one-time fee every cycle — see §5, finding B-2 |
| Membership | Freeze / Resume | Complete | `Actions/{Freeze,Resume}MembershipAction.php`, tested | Correctly extends `expires_on`/`grace_ends_on` |
| Membership | Suspend / Reactivate | Complete | `Actions/{Suspend,Reactivate}MembershipAction.php`, tested | Suspension correctly does not shift dates |
| Membership | `membership_freezes` table | Broken (dead code) | Model/table exist, never read or written | Freeze state lives on flat `memberships` columns instead |
| Membership | Cancellation (terminal) | Complete | `isTerminal()` guard, tested | |
| Membership | Daily expiry scheduler | Complete | `routes/console.php:11`, `MembershipExpiryProcessor.php` | Registered and scheduled |
| Membership | History / append-only event log | Complete | `Models/MembershipEvent.php:48-54` throws on mutate/delete | |
| Membership | Domain event → Notification listener coverage | Partial | `NotificationServiceProvider.php:30` | Only 4 of 8 membership events have listeners — see §5 |
| Membership | Upgrade / downgrade / transfer | Missing | Confirmed absent by grep | |
| Membership | Family / corporate membership | Missing | Confirmed absent | |
| Membership | Trial membership / day pass | Missing | Confirmed absent | |
| Billing | Invoice creation (items/discount/tax/joining fee) | Complete | `InvoiceCreatorService.php`, `InvoiceCalculator.php`, unit-tested | Negative-total and over-discount both rejected |
| Billing | Payment recording (cash/card/bank/online) | Complete | `PaymentRecorderService.php` | DB-unique idempotency key, row-locked |
| Billing | Partial / split payments | Complete | `PaymentController::split` | Splits one collection across up to 10 method parts |
| Billing | Refunds (backend) | Complete | `RefundProcessor.php:22-69` | Cannot exceed refundable balance (app-enforced + row lock) |
| Billing | Refunds (frontend UX) | Partial | `invoice-details-page.tsx:296-332` | No confirmation dialog, no submit guard — see §5 |
| Billing | Receipts (immutable, idempotent, access-controlled) | Complete | `ReceiptGeneratorService.php`, `ImmutableLedgerEntry` trait | Real IDOR protection verified |
| Billing | Installment schedules | Mocked | `installment_schedules` table + model exist, zero business logic references them | |
| Billing | Payment allocations | Mocked | `payment_allocations` table + model exist, never written | |
| Billing | Payment event ledger | Mocked | `payment_events` table + model exist, never written | Duplicate of the actually-used `billing_events` outbox |
| Billing | Outstanding balance report/page | Complete, but Unreachable | `OutstandingBalanceController.php` + page, `resources/js/modules/billing/navigation.ts` | Built end-to-end, no sidebar link — see §5 |
| Billing | Collection summary report/page | Complete, but Unreachable | `CollectionSummaryController.php` + page | Same navigation defect |
| Billing | Cash drawer reconciliation | Missing | Confirmed absent (no "drawer" concept anywhere) | |
| Billing | Tax rate configuration | Missing | Only free-text `tax_id` on Gym profile; rate entered manually per invoice | |
| Attendance | QR check-in credential issuance | Partial | `MemberQrCredentialService.php:15-30,96-104` | `expires_at` defaults to null — no automatic rotation |
| Attendance | Duplicate check-in prevention | Complete | App window + DB unique `open_presence_key`, row-locked | |
| Attendance | Membership validity/eligibility check | Complete | `AttendanceRecorderService::assessEligibility():287-370` | Correctly compensates for a weaker shared contract |
| Attendance | Branch access restriction | Complete (code) / Partial (tests) | Plan pivot rejection path untested | |
| Attendance | Corrections / reversals + audit trail | Complete | `AttendanceRecordMutationService.php`, append-only enforced | |
| Attendance | Occupancy / "live attendance" | Partial | `LiveAttendanceController.php:35-41` | In default mode means "checked in today," not true live headcount |
| Attendance | Staff attendance / clock-in | Missing | Confirmed absent by grep | |
| Attendance | Scan logs (forensic trail incl. failures) | Complete | `AttendanceScanLog`, append-only | No brute-force alerting beyond a generic rate limiter |
| Attendance | Kiosk scanner + manual check-in UI | Complete | `scanner-page.tsx`, `manual-page.tsx` | Real camera-based QR reader with fallback |
| Notification | In-app notifications | Complete | `DeliverNotificationJob.php:41-45` | |
| Notification | Email delivery | Partial | `DeliverNotificationJob.php:62-66` | Real transport, but `MAIL_MAILER=log` by default, no HTML template |
| Notification | SMS delivery | Mocked | `DeliverNotificationJob.php:41-45` — hardcoded permanent failure | Selectable in UI but never sends |
| Notification | WhatsApp delivery | Mocked | Same as SMS | |
| Notification | Templates (variable substitution, XSS-safe) | Complete | `SafeNotificationTemplateRenderer.php` | Allow-list enforced, HTML-escaped |
| Notification | Rules (event-triggered dispatch) | Complete (infra) / Partial (config) | `DatabaseNotificationDispatcher.php:30-37` | Zero seed data — produces nothing until an admin configures rules |
| Notification | Renewal/expiry reminders | Complete (pipeline) / Partial (default config) | `membership:process-expiry` → event → listener | Automated once rules exist |
| Notification | Payment/installment-due reminders | Missing | Confirmed absent by grep | |
| Notification | Birthday reminders | Missing | Confirmed absent by grep | |
| Notification | Delivery retry / attempt log | Complete | `notification_delivery_attempts`, `NotificationDeliveryController::retry` | |
| Notification | Announcements (schedule/dispatch/cancel) | Complete | `DispatchAnnouncementJob`, tested | |
| Report | Report catalogue (14 report types) | Complete | `DatabaseReportQuery.php` | Queries live tables directly, no denormalized drift |
| Report | Reconciliation with Billing ledger | Complete | `ReportApiTest.php:69-79` | Spot-checked, real assertion against cents |
| Report | CSV export (async, expiring, secure) | Complete | `GenerateReportExportJob.php`, `ReportExportController.php` | |
| Report | Excel / PDF export | Missing | No generator class exists; UI only offers CSV | Not misleadingly stubbed — just absent |
| Report | Export expiry cleanup scheduling | Broken | Command exists, **not** in `routes/console.php` | Exports accumulate indefinitely in production |
| Audit | Append-only audit log | Complete | `AuditLog.php:24-28` throws on mutate/delete | |
| Audit | Audit log viewer (backend filters) | Complete | `AuditLogController::index` — 8 filter dimensions | |
| Audit | Audit log viewer (frontend) | Partial | `audit-list-page.tsx` exposes only 1 of 8 filters | |
| Audit | Coverage across financially/operationally sensitive modules | Partial | 13 call sites total; zero in Membership, Billing, Member, Plan, Branch, Gym | See §5 |
| Staff | CRUD + invitation + branch assignment | Complete | `StaffController.php`, `StaffInvitationTest.php` | |
| Staff | Role assignment | Partial | `edit.tsx:131-153` — single-select UI despite many-to-many model | |
| Staff | Scheduling / shifts / rota | Missing | Confirmed absent by grep | |
| Branch | CRUD + opening hours | Complete | `BranchController.php`, validated JSON opening hours | |
| Branch | Branch-restricted listing (non-owner sees only assigned branches) | Broken | `BranchController::index()` — no restriction, tenant-wide | |
| Gym | Profile (business info, branding, tax ID, currency) | Complete | `GymProfileController.php`, includes today's uncommitted currency-editor addition | |
| Dashboard | Member/financial/renewal/branch-comparison KPI sections | Complete | `DashboardMetricsService.php:44-93` | Previously `pending_integration`, now real — confirmed fixed |
| Dashboard | "Today's operations" live stats row | Broken | `resources/js/modules/dashboard/contracts/operational-data-source.ts:15-23` | Hardcoded rejection despite a working backend endpoint existing |
| Dashboard | Branch filter | Backend Only | Hook exists (`useDashboardFilters`) but is dead code — no UI wired | |
| Dashboard | Date range filter | Complete | | |
| SaaS/Platform | Tenant subscription/plan-tier management | Missing | `tenants` table has no plan/trial/limit fields | |
| SaaS/Platform | Super-admin / platform-admin panel | Missing | Confirmed absent by grep | |
| SaaS/Platform | Backup/restore, system-level data import/export | Missing | Confirmed absent | |
| Cross-cutting | API rate limiting | Missing | `throttleApi()` never called; every `/api/v1/*` route unthrottled | |
| Cross-cutting | CI pipeline | Missing | No `.github/workflows/**` or equivalent; `composer.json`'s `ci:check` script is unused by any pipeline | |
| Cross-cutting | E2E test suite | Missing | No Playwright config; `.playwright-mcp/` is manual-session debris | |
| Cross-cutting | Concurrency/race-condition tests | Missing | Zero matches for concurrent/parallel/race patterns across the whole test suite | |

---

## 4. Critical Problems

| ID | Problem | Location | Business Impact | Recommended Fix | Priority |
|---|---|---|---|---|---|
| C-1 | Membership activates to `status=active` regardless of whether the invoice was paid | `app/Modules/Membership/Actions/SellMembershipAction.php:49,77-79`, `RenewMembershipAction.php:49,78-80`, `MembershipBillingOrchestrator.php:53,64,67-70` | Members get building/plan access without paying; `paid_in_full` is computed and silently discarded | Gate `$activatesNow` on the settlement's `paid_in_full` (or an explicit "activate on partial payment" policy flag, if intentional) | Critical |
| C-2 | Renewals re-charge the plan's one-time joining fee every cycle | `MembershipPriceCalculatorService.php`, `RenewMembershipAction.php:48,78`, `MembershipBillingOrchestrator.php:47` | Every renewal invoice is inflated by the joining fee; overcharges members and misstates revenue reports | Pass `isRenewal` into the price calculator and zero the joining fee on renewal invoices | Critical |
| C-3 | Branch-level data isolation is not enforced on Member/Membership/Staff/Branch listing endpoints | `MemberController::index()`, `MembershipController::index()`, `StaffController::index()`, `BranchController::index()` | A receptionist restricted to one branch can view (and in some flows edit) another branch's members/staff/memberships | Default all list queries to the caller's assigned branches unless the caller is an owner or holds an explicit "view all branches" permission | High/Critical (Critical once a multi-branch customer is live) |
| C-4 | SMS and WhatsApp notification channels are selectable in the UI but always fail | `app/Modules/Notification/Jobs/DeliverNotificationJob.php:41-45`, `template-form-page.tsx:104-106` | A gym owner who configures SMS/WhatsApp reminders will believe they're sending and never find out otherwise unless they check delivery logs | Either integrate a real provider (Twilio/WhatsApp Business API) or remove these channels from the template editor until implemented | High |
| C-5 | `reports:expire-exports` is never scheduled | `routes/console.php` (11 lines, no entry) | Generated CSV exports accumulate indefinitely in storage | Add `Schedule::command('reports:expire-exports')->daily();` | Medium |
| C-6 | Audit logging covers only Attendance/Staff/Roles/Notification-admin — Membership, Billing, Member, Plan, Branch, Gym mutations are unaudited | Grep of `AuditLogger::log(`/`->log(` across `app/` (13 call sites total) | The highest-stakes actions (payments, refunds, membership cancellations, member edits) leave no audit trail | Add `AuditLogger` calls to every mutating action in Membership/Billing/Member/Plan/Branch/Gym | High |
| C-7 | `User` model has no tenant scope | `app/Models/User.php` — no `BelongsToTenant` trait | Any future `User::query()`/`User::all()` call returns cross-tenant rows unless the author remembers to filter manually; matches the class of bug already documented as previously shipping in this codebase (see project memory) | Add an explicit, always-applied tenant scope to `User`, or a lint/test rule that flags un-scoped `User::` queries | High |
| C-8 | Three append-only tables the architecture doc claims are enforced are not | `PaymentEvent`, `NotificationDeliveryAttempt`, `MembershipStatusHistory` models — no `updating`/`deleting` hooks | Financial/audit history rows can be silently edited or deleted, contradicting the documented guarantee | Add the same `updating`/`deleting`-throw pattern used by `MembershipEvent`/`AuditLog`/`ImmutableLedgerEntry` | High |
| C-9 | Four Billing sequence tables (`invoice_sequences`, `payment_sequences`, `receipt_sequences`, `refund_sequences`) are dead schema; the real one (`billing_sequences`) isn't documented | `database/ARCHITECTURE.md` vs. `app/Modules/Billing/Services/BillingSequence.php` | The architecture doc actively misleads future engineers about which table is authoritative | Drop the four unused tables/models; correct the architecture doc | Medium |
| C-10 | Refund action has no confirmation dialog or double-submit guard | `resources/js/modules/billing/pages/invoice-details-page.tsx:296-332` | The single most financially sensitive, irreversible UI action in the app can be double-clicked or fat-fingered with no confirmation | Add a `ConfirmationDialog` (already used elsewhere in the app) and a `saving`-state submit guard | High |
| C-11 | Outstanding-balance and collection-summary billing pages are fully built but unreachable from the sidebar | `resources/js/modules/billing/navigation.ts` — `billingNavigation` export is never imported anywhere | Front-desk/finance staff cannot find "who owes money" or "today's takings" through the UI at all, despite the backend and page existing | Wire `billingNavigation`'s children into the exported `navigation` object (same pattern `reports/navigation.ts` already uses) | High |
| C-12 | Dashboard's "Today's operations" row is hardcoded to reject, despite a working backend endpoint | `resources/js/modules/dashboard/contracts/operational-data-source.ts:15-23` vs. `GET /api/v1/reports/dashboard/operational` (`OperationalDashboardService.php`) | Gym owners see "awaiting integration" on the primary dashboard permanently, for a feature that already works server-side | Wire the real data source in (shape mismatch — snake_case vs. camelCase, missing `peakPeriods` — needs a small adapter) | Medium |
| C-13 | No API rate limiting anywhere under `/api/v1/*` | `bootstrap/app.php` — `throttleApi()` never called | Billing, attendance-scan, and notification-dispatch endpoints can be hit at unlimited rate; login is throttled but the API surface behind it is not | Add `throttleApi()` (or a tuned per-route limiter) to the API middleware group | Medium |
| C-14 | Member document uploads have no MIME/extension allow-list and are stored on the public disk with client-supplied MIME type persisted | `app/Http/Requests/Members/StoreMemberDocumentRequest.php:19-22`, `MemberDocumentController.php:16` | Any staff member with `members.update` can upload an executable-in-browser file type (e.g. `.svg`/`.html`) to a public, unauthenticated URL — stored-content risk plus unauthenticated document access | Restrict to an explicit MIME/extension allow-list, detect MIME server-side, move to a private disk with signed/authenticated download URLs | High |
| C-15 | `branch_id`/`branch_ids` request validation is not tenant-scoped | `StoreMemberRequest.php`, `UpdateMemberRequest.php`, `StorePlanRequest.php`, `StoreInvoiceRequest.php` — bare `exists:branches,id` | A crafted request can pass validation with another tenant's branch ID | Use `Rule::exists('branches','id')->where('tenant_id', ...)` everywhere a branch ID is validated | Medium |

---

## 5. Bad or Dangerous Business Logic

### B-1. Membership activation is not gated on payment
- **Current behavior**: `SellMembershipAction::execute()` computes `$activatesNow = ! $dates->startsOn->isFuture();` before billing settlement even happens (`app/Modules/Membership/Actions/SellMembershipAction.php:49`). `MembershipBillingOrchestrator::settle()` computes a real `paid_in_full` boolean, but the caller only extracts `invoice_id` from the result (lines 77-79) — `paid_in_full`/`InvoiceResult::isPaidInFull()` are dead values. `initial_payment` is optional in `StoreMembershipRequest.php:37-38`.
- **Expected behavior**: a membership should only become `active` when its invoice is paid in full (or per an explicit, product-approved partial-payment activation policy).
- **Failure scenario**: front-desk sells a membership with `initial_payment` omitted, immediate start date → membership is `active` immediately with an unpaid invoice; member gets full access with $0 collected.
- **Related files**: `Actions/SellMembershipAction.php`, `Actions/RenewMembershipAction.php`, `Services/MembershipBillingOrchestrator.php`.
- **Recommended solution**: read `paid_in_full` from the settlement result; only set `$activatesNow` (or a distinct `pending_payment` status) accordingly, or require an explicit policy decision from product on whether partial-payment activation is allowed at all.
- **Required tests**: sell a membership with `initial_payment` omitted/zero and an immediate start date; assert the resulting status is not `active` (or, if partial activation is intentional, assert the invoice's outstanding balance is surfaced prominently on the member record).

### B-2. Joining fee re-charged on every renewal
- **Current behavior**: `MembershipPriceCalculatorService::calculate()` always includes `$plan->joining_fee`; `RenewMembershipAction` calls the same calculator with no `isRenewal` adjustment; `MembershipBillingOrchestrator::settle()` passes `joiningFee` unconditionally into the invoice DTO regardless of renewal status.
- **Expected behavior**: joining fees are one-time, new-member charges; renewal invoices should never include them.
- **Failure scenario**: a member renews a $50/month plan with a $25 joining fee; the renewal invoice totals $75 instead of $50, every single renewal.
- **Related files**: `Services/MembershipPriceCalculatorService.php`, `Actions/RenewMembershipAction.php:48,78`, `Services/MembershipBillingOrchestrator.php:47`.
- **Recommended solution**: pass an `isRenewal` flag through the price calculation chain and zero the joining fee when true.
- **Required tests**: assert renewal invoice `grand_total_cents` excludes the joining fee; regression-test that a first-time sale still includes it.

### B-3. Branch isolation is opt-in, not enforced, across four modules
- **Current behavior**: `Member::index()`, `Membership::index()`, `StaffController::index()`, `BranchController::index()` all filter by `branch_id` only when the client explicitly supplies it. None of these has a query-level default restricting results to the acting user's `user_branch` assignments; only tenant-wide permission slugs are checked.
- **Expected behavior**: a non-owner user restricted to specific branches should never see or edit records from branches they aren't assigned to, by default — not merely "if they happen to filter for it."
- **Failure scenario**: Branch-A front-desk staff with `members.view` calls `GET /members` with no `branch_id` param and receives every member across every branch in the tenant, including a competing branch manager's members.
- **Related files**: as above, plus `MemberPolicy`/`MembershipPolicy` (permission-only, no branch check).
- **Recommended solution**: derive a default branch scope from `SetBranchContext`/`user_branch` for non-owner roles at the query layer (a shared trait/query scope, applied consistently the way `TenantScope` already is for tenants).
- **Required tests**: branch-restricted user listing endpoints for Member/Membership/Staff/Branch, asserting only their assigned branch(es) are returned by default.

### B-4. QR attendance credentials have no default expiry
- **Current behavior**: `MemberQrCredentialService::cardForMember()` returns the same credential indefinitely; `expires_at` is set to `null` at issuance. Rotation only happens on an explicit staff-triggered action.
- **Expected behavior**: a rotating or time-limited token, per the standard "prevent screenshot sharing/replay" requirement for QR-based access control.
- **Failure scenario**: a member photographs their QR code and shares it (deliberately or accidentally); it remains valid for check-in indefinitely until a staff member notices and manually revokes it.
- **Related files**: `app/Modules/Attendance/Services/MemberQrCredentialService.php:15-30,96-104`.
- **Recommended solution**: set a default `expires_at` (e.g. 24-72 hours) on issuance and auto-reissue transparently on next portal/kiosk load; keep manual rotation as the "immediate revoke" path.
- **Required tests**: credential issued today is rejected after its default TTL elapses.

### B-5. `MembershipFreeze` table and model are dead code
- **Current behavior**: freeze state lives entirely on flat `memberships.freeze_started_on`/`freeze_resumes_on`/`frozen_days_used` columns; the dedicated `membership_freezes` table (owned by Membership per `database/ARCHITECTURE.md`) and its model are never read or written anywhere in the freeze workflow.
- **Expected behavior**: either the table is used as the freeze-history ledger (multiple freeze periods per membership, auditable), or it should not exist.
- **Failure scenario**: a member freezes and resumes a membership multiple times over its lifetime; there is no queryable history of individual freeze periods — only the most recent freeze's dates on the parent row.
- **Related files**: `app/Modules/Membership/Models/MembershipFreeze.php`, `Actions/{Freeze,Resume}MembershipAction.php`.
- **Recommended solution**: either wire freeze/resume actions to insert rows into `membership_freezes` (recommended — gives real freeze history) or drop the table/model as cleanup.
- **Required tests**: multiple freeze cycles on one membership produce a queryable history.

### B-6. Two overlapping membership-history tables with divergent delete semantics
- **Current behavior**: `membership_events.membership_id` uses `cascadeOnDelete()`; `membership_status_histories.membership_id` uses `restrictOnDelete()`. `MembershipEvent` enforces append-only at the model layer; `MembershipStatusHistory` has no such enforcement at all.
- **Expected behavior**: a single, consistently-enforced audit trail for membership lifecycle transitions.
- **Failure scenario**: if a membership row is ever removed via a path that bypasses the model-layer delete guard (a maintenance script, a future admin tool using raw `DB::table()`), its entire `MembershipEvent` trail — explicitly documented as "the authoritative audit trail" — disappears via cascade, while `membership_status_histories` rows remain but were never protected from ad-hoc mutation in the first place.
- **Related files**: `2026_07_23_210002_create_membership_events_table.php`, `2026_07_23_210003_create_membership_lifecycle_extension_tables.php`, `Models/MembershipStatusHistory.php`.
- **Recommended solution**: consolidate to one table, or at minimum give both the same `restrictOnDelete()` + append-only model enforcement.
- **Required tests**: attempting to delete or update a `MembershipStatusHistory` row throws, matching `MembershipEvent`'s behavior.

### B-7. Status columns without a backing enum drift silently
- **Current behavior**: `Tenant`, `User`, `Branch`, `ReportExport`, `NotificationDelivery`, `Announcement`, `NotificationTemplate`, `NotificationRule`, `MembershipFreeze`, `MemberPortalAccount`, `InstallmentSchedule` all use plain uncast string `status` columns, compared via raw string literals (`=== 'active'`, `=== 'failed'`, etc.) scattered across controllers/jobs.
- **Expected behavior**: the same PHP backed-enum pattern already used correctly for `MemberStatus`, `PlanStatus`, `MembershipStatus`, `InvoiceStatus`, `PaymentMethod`, `AttendanceStatus`.
- **Failure scenario**: a future edit introduces a typo'd status literal (`'cancelld'`) in one of the ~10 raw-string comparison sites; it fails silently at runtime with no static-analysis or IDE safety net, unlike the enum-backed modules where Larastan would catch it.
- **Related files**: as listed above.
- **Recommended solution**: introduce backed enums for these statuses and cast them, matching the pattern the rest of the codebase already proves works.
- **Required tests**: none new required — this is a static-safety improvement, covered by existing behavioral tests remaining green.

---

## 6. Missing Essential Features

### Must Have Before Selling
- **Payment-gated membership activation** (see B-1) — a paying customer will immediately notice free access being granted.
- **Fix the joining-fee renewal bug** (see B-2) — customers will notice being overcharged.
- **Enforce branch isolation** (see B-3) — any multi-branch customer's staff will immediately see this as a trust violation.
- **A real SMS or WhatsApp channel, or removal of the fake options** — advertised and non-functional is worse than absent.
- **Audit coverage for financial and membership mutations** — a gym owner disputing "who changed this payment/membership" needs an answer the system currently cannot give.
- **Fix billing navigation dead-ends** (Outstanding Balances, Collection Summary) — these are core daily front-desk/accounting tools that are currently invisible.
- **CI pipeline** running the existing (good) test suite on every push/PR — without this, regressions in the areas that *are* well-tested today can silently reach production.

### Must Have for Professional Gyms
- **Tax rate configuration at the gym level** (currently manual per-invoice entry every time) — professional operators expect a default tax rate applied automatically, with manual override only when needed.
- **Cash drawer reconciliation** — any gym taking cash payments needs an open/close/count/reconcile workflow; currently there's only a read-only collections report.
- **Payment/installment-due reminders and birthday reminders** — both are named directly in the audit brief as expected features and are entirely absent; they're also standard retention/relationship tools for gym operators.
- **Health notes / PAR-Q intake** — a liability-relevant gap for any gym offering physical training; currently there's no structured field for this at all.
- **Multiple emergency contacts** — currently a single flat name/phone pair.
- **Staff scheduling/shifts** — Staff module today is pure account management; there's no rota/shift concept, which most gyms with front-desk coverage will expect.
- **Excel/PDF report export** — CSV-only limits usefulness for owners who want a formatted, presentable report.
- **Real-time or near-real-time occupancy** (current "live" attendance in the default mode is really "checked in today," not current headcount) — gyms marketing capacity/crowding info to members need this to be accurate.

### Advanced Competitive Features
- **Plan upgrade/downgrade with proration** — currently the only path is a full renewal into a different plan at the next cycle boundary.
- **Membership transfer between members** — common in gym operations (member moving away, gifting remaining term).
- **Family/corporate/group memberships** — a meaningful revenue segment for many gyms, entirely unsupported.
- **Trial memberships and day passes** — standard acquisition tools, entirely unsupported.
- **Global search across the app** — currently every table has its own local search only.
- **Mobile-optimized data tables app-wide** — a shared `DataTable` component with a genuine mobile card layout exists but is used in only 4 of 18+ table-heavy pages.

### Future SaaS Features
- **Tenant subscription/plan-tier management** — the `tenants` table has no plan/trial/limit columns at all; there is no way for the platform operator (you, selling this to multiple gyms) to meter or gate usage.
- **Platform/super-admin panel** — no cross-tenant administrative surface exists to manage customers, view platform health, or support tenants.
- **System-level backup/restore and data import/export** — the only "export" concept today is per-report CSV; there's no full-tenant data export or backup/restore tooling.
- **Usage-based billing/limits enforcement** (branch count caps, staff seat limits, member count tiers) tied to the future subscription layer above.

---

## 7. User Experience Problems

| Existing problem | Affected user | Current steps | Recommended workflow | Expected benefit |
|---|---|---|---|---|
| Outstanding Balances / Collection Summary pages exist but have no sidebar link | Receptionist, accountant | Must know/guess the URL (`/billing/outstanding`, `/billing/collections`) | Wire `billingNavigation`'s children into the sidebar under Billing | Restores a daily-use workflow that's currently invisible |
| Refund has no confirmation step | Accountant/manager | One click, irreversible | Add a `ConfirmationDialog` (pattern already used for membership cancel/suspend) | Prevents accidental irreversible refunds |
| Status badge colors are inconsistent across modules (Members/Plans use grayscale; Memberships uses a semantic tone system) | All staff | N/A — a perception/scanning cost, not a step count | Route Member/Plan status badges through the shared `StatusBadge`/`toneForStatus()` | Faster at-a-glance status recognition during busy periods |
| Table-heavy pages (members, memberships, plans, billing) fall back to horizontal scroll on mobile/tablet instead of a card layout | Front-desk staff on a tablet | N/A | Adopt the existing `shared/DataTable` component (already used in 4 pages, has a real mobile fallback) across all list pages | Usable on the tablets front-desk staff actually use during a busy period |
| Dashboard's operational stats row permanently shows "awaiting integration" | Gym owner, manager | N/A — looks broken on the primary landing page | Wire the existing working backend endpoint in | First impression of the product on every login |
| Audit log viewer only exposes 1 of 8 backend filter dimensions | Owner/manager investigating a dispute | Must manually scan chronologically | Expose actor/entity/branch/date filters already supported server-side | Investigations that currently take minutes take seconds |
| Notification template editor has no live preview of variable substitution | Manager writing a reminder template | Save → send test → check delivery log to see the real output | Add an inline preview panel rendering the template against sample data | Fewer trial-and-error send cycles |
| Document upload has no drag-drop, progress bar, or client-side size/type pre-check | Front-desk staff | Select file → submit → wait for a server error if the file is wrong | Add client-side validation before submit, drag-drop target | Fewer failed submissions during member registration |
| Sales role assignment supports only one role per staff member via the UI, despite the data model supporting many | Manager | Must pick a single role that covers everything the staff member needs | Multi-select role assignment (already many-to-many in the backend) | More precise, layered permission grants |
| Branch management is nested three levels deep (Settings → Gym Settings → Branches) rather than being a top-level item | Owner/manager | 3 clicks to reach a frequently-used admin page | Promote Branches to a top-level nav item (as recommended in §8) | Fewer clicks for a common admin task |

**Faster workflows for the named scenarios:**
- **Registering a new member**: already close to optimal (single form + duplicate-warn flow); the main improvement is client-side pre-validation so obvious errors (missing required field) don't require a round trip.
- **Activating a membership / receiving a payment**: currently correct in flow, but should visibly reflect "unpaid" status once B-1 is fixed rather than silently activating — this is a UX requirement flowing directly from the business-logic fix.
- **Renewing a membership**: the "just registered" quick-pick UX already added in today's uncommitted work (`create.tsx:79-84`) is a good pattern — extend it to renewal (surface members with memberships expiring within N days as quick-picks on the renewal page).
- **Checking in a member**: already fast (kiosk scanner + camera QR read + manual fallback) — no changes recommended here.
- **Finding an overdue payment**: currently requires knowing the direct URL to Outstanding Balances (see above) — fixing the nav link fixes this workflow entirely.
- **Printing or sending a receipt**: already complete and fast (immutable snapshot, print view, member-portal self-service access).
- **Freezing a membership**: already has a confirmation/reason dialog — no changes recommended.
- **Viewing a member's complete history**: the member detail page is genuinely complete (photo, status, documents, membership card, payment history, portal-invite panel) — no changes recommended.

---

## 8. Recommended Sidebar and Navigation

The current sidebar (`resources/js/components/app-sidebar.tsx` + auto-loaded `modules/**/navigation.ts`) is data-driven and permission-aware — a real strength — but has three concrete defects worth fixing alongside a structural regrouping:

1. **Members and Plans have no `permission` field on their nav items at all** — they render for every authenticated user regardless of `members.view`/`plans.view` grants, unlike every other module. **Fix**: add explicit permission gates matching their policies.
2. **Billing's top-level nav item also has no `permission` field**, and its real sub-navigation (`billingNavigation` in `resources/js/modules/billing/navigation.ts`) is dead code — never imported. **Fix**: gate the top-level item and wire the children in (this is the same fix as C-11).
3. **Branches has no top-level nav entry** — it's manually nested under Settings → Gym Settings, three clicks deep, despite being a frequently-used admin function for multi-branch gyms.

Based on the actual modules found in the codebase (not the illustrative structure in the audit brief), the recommended top-level grouping is:

- **Overview** — Dashboard (existing `dashboard.view` gate, keep as-is; fix the operational-stats wiring per C-12)
- **Members** — Members, Member Portal invitations (currently under Members' own page, keep), Plans (grouped here since a plan is what a member is sold)
- **Memberships** — Memberships, Renewals (already correctly grouped together via shared `memberships.view` permission)
- **Attendance** — QR Scanner, Manual Check-in, Live Attendance, History, Settings (already well-structured, keep as a group)
- **Billing** — Invoices, Payments, Outstanding Balances, Collections (fix per C-11; this is the single highest-value nav fix in the app)
- **Staff & Branches** — Staff, Branches (promote Branches out from under Settings; both are day-to-day operational management, not configuration)
- **Communications** — Notification Center, Templates, Rules, Delivery Logs, Announcements (already correctly grouped, currently mislabeled into "settings" group internally — cosmetic fix to its `group` value)
- **Reports** — Report Catalogue + the 14 report types (already correct)
- **Administration** — Export History, Audit Logs, Gym Profile, Roles (genuine configuration/platform-admin items belong here, separate from Staff & Branches' day-to-day operations)

This keeps every currently-working piece of navigation intact while fixing the two nav items that leak past permission checks (Members, Plans, Billing top-level) and un-burying Branches and Billing's sub-pages — the two changes that most directly affect daily front-desk/finance work.

---

## 9. Security and Privacy Risks

**Critical**
- None found that are both currently exploitable and unmitigated by a compensating control. (The closest candidate, C-1's payment-gated activation gap, is a business-logic/financial-integrity issue rather than a classic security vulnerability, and is tracked in §4/§5 instead.)

**High**
- **Member document uploads accept any file type, persist the client-supplied MIME type, and are served from the public disk with no auth check** (C-14). A staff member with `members.update` can upload a script-executing file type to a URL reachable by anyone, and any member document — potentially containing sensitive personal information — is reachable by anyone who obtains its URL, protected only by filename unguessability. **File/variable**: `app/Http/Requests/Members/StoreMemberDocumentRequest.php`, `MemberDocumentController.php`.
- **`User` model has no tenant scope** (C-7). Every future query against `User` must remember to filter by `tenant_id` manually; today's code was verified to do this correctly everywhere it's queried, but there is no structural guard preventing a future regression — exactly the class of bug this project's own history shows has shipped before. **File**: `app/Models/User.php`.
- **Branch isolation gap** (C-3/B-3) is also a privacy risk, not just a UX one — it's cross-branch (not cross-tenant) exposure of member PII, staff records, and membership data to staff who shouldn't see them.

**Medium**
- **No API rate limiting** on `/api/v1/*` (C-13) — login itself is throttled, but the entire authenticated API surface behind it, including payment recording and attendance scanning, is not.
- **CORS configuration is an unreviewed framework default** — no `config/cors.php` is published; the effective config is `allowed_origins: ['*']` with `supports_credentials: false` (which limits the practical impact, but this should be an explicit, reviewed choice before production, not an inherited default).
- **`branch_id`/`branch_ids` request validation is not tenant-scoped** (C-15) — `exists:branches,id` checks existence globally, not within the caller's tenant, in Member/Plan/Billing request classes.
- **Cross-tenant existence-enumeration on two web routes**: `app/Modules/Staff/web.php:12-16` and `app/Modules/AccessControl/web.php:8-10` bind `{staff}`/`{role}` route parameters via models (`User`, `Role`) that lack `BelongsToTenant`, and neither route calls `$this->authorize()`. The actual data fetch that follows is properly policy-guarded at the JSON API layer, but these two Inertia page routes will return 200 (vs. the expected 404) for another tenant's user/role ID, leaking existence.
- **`config/session.php`'s `secure` cookie flag depends on an unset-by-default env var** (`SESSION_SECURE_COOKIE`) rather than being forced true — a misconfigured production deploy that forgets to set it sends session cookies over plain HTTP.

**Low**
- **CSV/report and audit export access is otherwise solid** — private-disk storage, never exposes `file_path`/`disk` in JSON, tenant/owner/expiry-gated downloads, all verified by tests. No finding here beyond the unscheduled cleanup command (C-5).
- **Dead route collision** between `routes/notifications.php` and `app/Modules/Notification/web.php` (both register `GET /notifications`) — the first is silently evicted by Laravel's route table; both point at identical, correctly-protected content, so there's no actual exposure, just dead code worth removing.
- **`notification_delivery_attempts`'s auto-generated unique index name sits at exactly MySQL's 64-character limit** — works today, zero margin for a future column rename; not itself a security issue but a fragility worth naming here since it borders on availability (a broken migration on deploy).

---

## 10. Architecture and Code Quality Improvements

**Three coexisting authorization mechanisms.** Six real Laravel Policy classes exist (`MembershipPolicy`, `StaffPolicy`, `BranchPolicy`, `RolePolicy`, `MemberPolicy`, `PlanPolicy`), registered (explicitly or via Laravel's naming convention) in `app/Providers/AuthorizationServiceProvider.php`. Every other module (Attendance, Billing, Notification, Report, Audit, Dashboard, Gym) instead uses ad-hoc `*Authorizer` service classes that call `hasPermission()`/`hasRole('owner')` directly, bypassing Gate/Policy entirely. This is internally consistent per-module but means `$this->authorize()` is a false safety net in 7 of 13 modules — a future contributor calling it against a Billing model would get a confusing "no policy resolved" failure instead of the expected authorization check. **Recommendation**: standardize on one mechanism. Given the Authorizer-service pattern already covers the majority of modules and handles the branch-scoping logic Policies don't currently do well (see §5 B-3), consider promoting it to the house standard and migrating the 6 Policy classes to match, rather than the reverse.

**Two module conventions (`app/Modules/*` vs. flat `app/*`).** Documented and stable, but every new contributor needs to be told this explicitly — it's not discoverable from the code alone. **Recommendation**: either migrate Member/Plan into `app/Modules/Member`/`app/Modules/Plan` in a dedicated low-risk refactor PR, or add a prominent note in the top-level `CLAUDE.md`/`README.md` explaining the split (currently only in `INTEGRATION_NOTES.md`, which a new contributor is unlikely to read in full).

**Dead schema and dead code accumulating from the merged-worktree history**: `invoice_sequences`/`payment_sequences`/`receipt_sequences`/`refund_sequences` tables, `payment_allocations`, `payment_events`, `installment_schedules` models, `membership_freezes`, and the `Testing/Fake{InvoiceCreator,PaymentRecorder,ReceiptGenerator}` classes in Membership are all unused. **Recommendation**: a dedicated cleanup pass — either wire these up to real functionality (payment_allocations and installment_schedules are genuinely useful features worth building) or remove them, since a table/model that exists but is never touched is worse than absent — it actively misleads whoever reads `database/ARCHITECTURE.md` or greps for usage next.

**`DatabaseReportQuery`'s private aggregation methods have Larastan generic-mismatch warnings** (documented in `INTEGRATION_NOTES.md` as a known, accepted limitation — narrower `Collection` shapes than the `array<string, mixed>` interface declares). Not a runtime bug, but worth resolving properly (typed DTOs per report instead of loosely-typed arrays) the next time this file is touched, rather than continuing to suppress it.

**No queue/cache tuning documented** — the codebase uses Laravel's queue system for notification delivery, exports, and announcements, but there's no evidence of queue worker supervision configuration (Supervisor/Horizon) or documentation for production deployment. This belongs in the Production Readiness Checklist (§17) as an explicit gap.

**Recommended design pattern additions, scoped narrowly**:
- A single shared "branch-scoped query" trait/scope (mirroring `BelongsToTenant`/`TenantScope`) to close the branch-isolation gap in §5 B-3 consistently rather than module-by-module.
- A shared `AppendOnlyLedgerEntry` trait already exists in spirit (`ImmutableLedgerEntry`) — extend its use to `PaymentEvent`, `NotificationDeliveryAttempt`, `MembershipStatusHistory` rather than re-inventing per-model hooks each time.

---

## 11. Database Improvements

- **Fix the append-only enforcement gaps** on `payment_events`, `notification_delivery_attempts`, `membership_status_histories` (C-8) — extend `ImmutableLedgerEntry`/the `MembershipEvent` pattern to these models.
- **Remove or repurpose the four dead Billing sequence tables** (C-9) and correct `database/ARCHITECTURE.md`'s ownership map, which currently documents the wrong ones.
- **Give `plan_price_histories` a `tenant_id` column and tenant scope** — it's currently the one financial-adjacent history table not directly tenant-scoped or protected by `BelongsToTenant`; any direct query against it bypasses tenant isolation entirely.
- **Reconcile inconsistent delete-cascade policy for the same conceptual relationship**: `invoices.member_id` and `attendance_scan_logs.member_id` use `nullOnDelete()` while their sibling tables (`memberships.member_id`, `attendance_records.member_id`) use `restrictOnDelete()` for the same "does this financial/attendance record survive a member deletion" question. Standardize — likely `restrictOnDelete()` everywhere given members currently have no real delete path anyway.
- **Add a `tenant_id` scope to the `User` model** (C-7) at the database/query layer, not just as a documentation note.
- **Introduce backed PHP enums for the ~10 currently-raw-string status columns** listed in §5 B-7, matching the pattern already proven in Member/Plan/Membership/Invoice/Payment/Attendance.
- **Give `notification_delivery_attempts`'s unique index an explicit short name** — it currently sits at exactly MySQL's 64-character identifier limit with zero margin.
- **Wire up `payment_allocations`** if per-invoice-item payment tracking is a real product requirement (it's currently dead schema) — this is the correct place to fix the "invoice totals could theoretically desync from allocations" drift risk noted by the schema audit, since an unenforced, unused ledger table is strictly worse than either using it properly or removing it.
- **Audit fields**: coverage is good (`tenant_id`, `branch_id`, timestamps present broadly), but should be extended per C-6 to ensure every Membership/Billing/Member/Plan/Branch/Gym mutation actually writes an `AuditLog` row, not just that the table/model supports it.
- **Attendance uniqueness**: already solid — `unique(['tenant_id','request_id'])` idempotency plus the `open_presence_key` global unique constraint for "currently checked in" state are both real, DB-enforced, and tested.

---

## 12. API Improvements

- **Route consistency**: the `/api/v1/*` auto-loading convention is genuinely good and should be preserved as-is; the remaining manual `require` lines for the flat-convention modules (Member/Plan/Settings/Reports/Notifications web routes) are the one inconsistency, tied to the broader module-convention question in §10.
- **Response structure**: `app/Shared/Support/ApiResponse.php` exists as the shared response shape — verify it's used consistently across all modules' JSON resources rather than each module rolling its own envelope (not independently confirmed for every controller in this audit; worth a follow-up pass).
- **Authorization consistency**: standardize on one of the two authorization mechanisms described in §10 so every controller can rely on `$this->authorize()` working uniformly.
- **Filtering/branch-scoping**: apply the branch-isolation fix from §5 B-3 at the query/scope layer so it's automatically consistent across every list endpoint rather than each controller needing to remember to check it.
- **Rate limiting**: add `throttleApi()` (C-13) with sensible per-endpoint tuning — attendance scan endpoints already have their own dedicated rate limiter (`AttendanceScanRateLimit`) as a good precedent to extend to Billing payment/refund endpoints.
- **Idempotency**: already a real strength — Billing (invoices/payments/refunds/receipts), Attendance (check-ins/corrections/reversals), and Notification (deliveries) all enforce idempotency keys with genuine DB unique constraints, not just app-level checks. No changes needed here; this is worth explicitly preserving as new modules are added.
- **Versioning**: the `/v1` prefix exists but there's no evidence of a versioning strategy for breaking changes (no `/v2` precedent, no deprecation-header convention). Worth documenting intent even if v2 isn't needed yet.
- **Validation**: tighten branch-ID validation per C-15; otherwise FormRequest-based validation is consistently used and well-tested across modules.

---

## 13. Frontend Improvements

- **Component reuse**: consolidate the three divergent status-badge implementations (Members/Plans bypass the shared `StatusBadge`) and expand `shared/DataTable` usage from 4 pages to the ~18 table-heavy pages currently hand-rolling `<Table>` — this is the single highest-leverage frontend change, fixing both visual consistency and mobile responsiveness in one pass.
- **State management**: the Inertia-only pattern (no client cache layer) is a coherent, deliberate choice and works fine for this app's access patterns — no change recommended; don't introduce React Query/Zustand without a concrete need, since consistency here is valuable.
- **Data fetching**: no changes needed structurally; the `useFlashToast` + Inertia flash-message pattern for success/error feedback is a genuinely good, underappreciated piece of this codebase — worth calling out as a positive to preserve, not just improve.
- **Forms**: the current pattern (Inertia `useForm` + server-driven `errors`, no client schema library) is consistent across the app — acceptable, though adding lightweight client-side pre-validation (matching the backend rules) for the highest-traffic forms (member registration, payment collection) would reduce round-trips without abandoning the server-as-source-of-truth pattern.
- **Accessibility**: no material gaps found — Radix primitives are used consistently, no `<div onClick>` anti-patterns anywhere in the codebase. Maintain this discipline as new components are added.
- **Responsiveness**: see component-reuse above; this is the concrete, fixable gap.
- **Performance**: no N+1 query issues found in any of the audited controllers (Member, Plan, Membership, Billing, Dashboard all eager-load appropriately) — this is a genuine strength worth preserving via code review discipline as new list/index endpoints are added.
- **User feedback**: extend the toast/flash pattern to the two flows currently missing a submit guard (refund, split payment — see C-10 and the Billing audit) rather than introducing a new feedback mechanism.
- **Navigation permission gates**: fix Members/Plans/Billing's missing `permission` fields per §8.
- **Global search**: currently entirely absent; if prioritized, a `cmdk`-based command palette searching across members/memberships/invoices by name/number would be a meaningful front-desk speed improvement, but this is a "nice to have," not a defect.

---

## 14. Reporting and Analytics Improvements

The reporting engine itself (`DatabaseReportQuery`, 14 report types) is a genuine strength — real queries against live tables, verified reconciliation with Billing's actual ledger, tenant/branch-scoped, timezone-correct bucketing. Improvements should build on this foundation rather than replace it:

- **Excel/PDF export**: add generators implementing the existing `ExportGenerator` interface alongside `CsvExportGenerator` — the async job/expiry/download-security infrastructure already supports any format without further backend rework.
- **Payment/installment-due and birthday reports**: pair with the corresponding missing notification automations (§6) — these are naturally the same underlying data queries surfaced two ways (a report an owner pulls on demand, and a notification a member/staff receives proactively).
- **Cash drawer reconciliation report**: once the drawer feature itself exists (§6), pair it with a report closing out each shift/day.
- **Audit log viewer parity**: expose the 7 currently-hidden backend filter dimensions in the frontend (§7) — no backend work required, purely a frontend gap.
- **Operational dashboard**: wire the existing `GET /api/v1/reports/dashboard/operational` endpoint into the dashboard's "Today's operations" row (C-12) — this closes a real gap using work that's already done.
- **Scheduled report delivery**: none of the 14 report types currently support "email me this report every Monday" — a natural extension once the notification email channel (already real) is generalized beyond event-triggered sends.

---

## 15. Notification and Automation Improvements

Recommended event-driven automation, keyed to what already exists vs. what's genuinely new:

| Trigger | Current state | Recommendation |
|---|---|---|
| Membership activation | `MembershipActivated` event exists and has a listener | No change — working |
| Upcoming expiration | `MembershipExpiring` event, scheduled daily, has a listener | Working, but produces nothing until an admin creates a `NotificationRule` + template — ship sensible default rules/templates out of the box for new tenants |
| Expiration | `MembershipExpired` event, scheduled, has a listener | Same as above |
| Missed/overdue payments | No event, no listener, no scheduled check | New: add an overdue-invoice detection sweep (parallel to `membership:process-expiry`) dispatching a `PaymentOverdue`-style event |
| Successful payments | `PaymentCompleted` bridged from Billing, has a listener | Working |
| Membership freeze/suspend/cancel/creation | Events dispatch (`DB::afterCommit`), but `NotificationServiceProvider` only listens to `MembershipActivated`/`MembershipExpiring`/`MembershipExpired`/`MembershipRenewed` | Add listeners for the 4 currently-unhandled events (§5 inventory) |
| Attendance | No notification hooks found | New, lower priority — most gyms don't need per-checkin notifications, but a "member hasn't checked in for N days" inactivity trigger (below) is higher value |
| Birthdays | Confirmed entirely absent | New: requires a scheduled daily sweep comparing `date_of_birth` to today, dispatching a `MemberBirthday` event |
| Inactive members | Confirmed entirely absent | New: a scheduled sweep flagging members with no attendance in N days — valuable for retention-focused gyms and can reuse the existing `AttendanceRecord` query patterns already proven correct in Reports |
| Failed notifications | Retry/attempt tracking already exists (`notification_delivery_attempts`, manual retry UI) | Add an automated escalation: after N automatic retries fail, surface a dashboard/notification-center alert to staff rather than requiring someone to check the delivery log proactively |

**The SMS/WhatsApp gap (C-4) sits underneath all of the above** — until real providers are integrated, every automation in this table that assumes SMS/WhatsApp delivery will silently no-op for those channels while appearing configured. This should be resolved before marketing any of the above as "automated reminders" to prospective customers.

---

## 16. Testing Strategy

Ordered by risk, given the current state (backend feature-test coverage is genuinely strong; the gaps are concurrency, E2E, frontend page-level, and CI):

1. **Concurrency/race-condition tests (highest priority gap)** — zero tests anywhere exercise real parallel requests, despite the architecture depending heavily on `lockForUpdate()` row-locking to prevent double-payment, double-refund, and duplicate-check-in races. Add tests that genuinely dispatch simultaneous requests (e.g. via parallel HTTP clients or `Bus::fake` + concurrent job dispatch) against: payment recording, refund processing, membership sequence-number issuance, and attendance duplicate check-in.
2. **Business-logic regression tests for C-1 and B-2** — write the failing tests first (sell with `initial_payment` omitted; renew and assert joining fee excluded), confirm they fail against current code, then fix and confirm green. This is the highest-value test-writing work in the whole codebase right now.
3. **CI pipeline** — wire the existing `composer.json` `ci:check` script (lint → format:check → types:check → test) and the frontend equivalent (`npm run lint:check && npm run types:check && npm run test`) into a GitHub Actions workflow (or equivalent) gating merges to `dev`/`main`. Without this, the strong test suite that exists today provides no actual regression protection.
4. **Branch-isolation feature tests** — for every list/index endpoint identified in §5 B-3 (Member, Membership, Staff, Branch), add a test asserting a branch-restricted user only sees their assigned branch(es) by default.
5. **Frontend page-level tests** — current Vitest coverage (21 files) is almost entirely shared-component-level; there is no test for the Members, Memberships, Billing, Staff, Branches, Roles, or Settings pages/forms as integrated units. Prioritize the financially sensitive ones (invoice creation, payment/refund forms) first.
6. **E2E test suite** — introduce Playwright (config doesn't currently exist despite the ad-hoc `.playwright-mcp/` artifacts suggesting it's been used manually) covering the golden-path workflows named in §18: register → sell membership → collect payment → check in → renew.
7. **Security tests** — extend the existing tenant-isolation test pattern (already well-proven across modules) to explicitly cover the branch-isolation gap and the two unscoped web routes (Staff/Role) identified in §9.
8. **Performance tests** — none currently exist; given no N+1 issues were found in this audit, this is lower priority than the above, but worth a baseline load test on the Dashboard and Report endpoints before onboarding a large customer.

**By category**:
- *Unit*: price/date calculators (already good — extend for B-2's fix), enum/status transitions once backed enums are introduced (§5 B-7).
- *Feature/integration*: branch isolation (new), payment-gating regression (new), notification listener coverage for the 4 currently-unhandled Membership events (new).
- *API*: rate-limiting behavior once `throttleApi()` is added (new).
- *Frontend component*: continue the current pattern, extend to page-level.
- *E2E*: new, Playwright, golden-path workflows.
- *Security*: branch isolation, unscoped web routes, file-upload MIME restriction once C-14 is fixed.
- *Performance*: baseline load tests on Dashboard/Reports, deferred until after the above.

---

## 17. Production Readiness Checklist

- [ ] Fix payment-gated membership activation (C-1)
- [ ] Fix joining-fee renewal double-charge (C-2)
- [ ] Enforce branch-level data isolation on Member/Membership/Staff/Branch listing (C-3)
- [ ] Resolve the SMS/WhatsApp channel gap — integrate a real provider or remove from UI (C-4)
- [ ] Schedule `reports:expire-exports` (C-5)
- [ ] Extend audit logging to Membership/Billing/Member/Plan/Branch/Gym mutations (C-6)
- [ ] Add tenant scope to the `User` model (C-7)
- [ ] Enforce append-only behavior on `PaymentEvent`, `NotificationDeliveryAttempt`, `MembershipStatusHistory` (C-8)
- [ ] Remove or correctly document the dead Billing sequence tables (C-9)
- [ ] Add confirmation dialog + submit guard to the refund action (C-10)
- [ ] Fix Billing sidebar navigation to expose Outstanding Balances / Collection Summary (C-11)
- [ ] Wire the real operational-stats endpoint into the dashboard (C-12)
- [ ] Add API rate limiting (`throttleApi()`) (C-13)
- [ ] Restrict member document upload MIME types and move to authenticated storage access (C-14)
- [ ] Tenant-scope all `branch_id`/`branch_ids` validation rules (C-15)
- [ ] Publish and review an explicit `config/cors.php` for production
- [ ] Force `SESSION_SECURE_COOKIE=true` in production environment configuration (documented, not just possible)
- [ ] Add a CI pipeline running `ci:check` (backend) and lint/types/test (frontend) on every PR
- [ ] Add concurrency/race-condition tests for payment, refund, and attendance check-in paths
- [ ] Add an E2E smoke suite covering the golden path (register → sell → pay → check in → renew)
- [ ] Configure and document a production queue worker strategy (Supervisor/Horizon) for notification/export/announcement jobs
- [ ] Decide and document a tax-configuration story (even a simple tenant-level default rate) before onboarding real customers
- [ ] Add a cash-drawer reconciliation workflow if cash payments are expected at launch
- [ ] Resolve the two unscoped Staff/Role web routes (existence-enumeration)
- [ ] Confirm production `.env` does not inherit `APP_DEBUG=true` from `.env.example`
- [ ] Load/perf baseline on Dashboard and Report endpoints before onboarding a large multi-branch customer

---

## 18. Recommended Version 2 Workflows

1. **New member registration**: form submit → `StoreMemberRequest` validation → `DuplicateMemberFinder` check (extend to also run on update) → tenant-scoped `MemberNumberGenerator` → transactional create + photo store → `MemberRegistered` event after commit → toast confirmation → member detail page. *Already essentially correct end-to-end; only the update-time duplicate check is missing.*
2. **Membership activation**: sell form submit → `StoreMembershipRequest` validation → `MembershipPriceCalculatorService` (fixed per B-2 to exclude joining fee on renewal) → `MembershipBillingOrchestrator::settle()` → **read `paid_in_full` from the result and gate activation on it (fixes C-1)** → `SellMembershipAction` commits membership + invoice/payment/receipt transactionally → domain events after commit → member detail page shows either "Active" or "Active — payment pending $X" clearly.
3. **Payment collection**: payment form (with `saving` guard, already present) → `PaymentRecorderService` row-locks invoice, DB-idempotent → receipt auto-generated → toast confirmation → invoice detail updates in place. *Already correct; extend the same submit-guard discipline to refunds and split payments.*
4. **Membership renewal**: renewal form (extend today's "just registered" quick-pick pattern to "expiring soon" quick-picks) → `RenewMembershipAction` computes `starts_on` from current `expires_on` (verified correct, no changes needed) → billing settlement **excluding joining fee** → confirmation.
5. **Membership freeze**: already correct — reason-required confirmation dialog → `FreezeMembershipAction` extends dates → event → history entry. *Recommend also writing to `membership_freezes` per B-5 for real freeze history.*
6. **Membership cancellation**: already correct — destructive confirmation dialog → `CancelMembershipAction` (terminal, guarded against re-cancel) → event → **add an `AuditLogger` call here per C-6**.
7. **Member check-in**: already correct and fast — kiosk QR scan → `AttendanceRecorderService::assessEligibility()` (defense-in-depth status/grace/branch checks, verified correct) → accept/reject with clear reason → scan log written regardless of outcome. *Recommend adding a default QR credential TTL per B-4.*
8. **Refund processing**: **add a confirmation dialog and submit guard (fixes C-10)** → `RefundProcessor` row-locks payment, enforces refund ≤ refundable balance → new `PaymentRefunded` event → **add an `AuditLogger` call per C-6** → receipt/invoice status updates.
9. **Staff account creation**: invite form → signed-URL invitation email → staff accepts, sets password → branch assignment → **extend role assignment to multi-select** (currently single-role only) → tested end-to-end already, just needs the UI extension.
10. **Branch creation**: form → validated opening hours → **promote Branches to a top-level nav item** (currently buried under Settings) → created branch immediately available in branch-filter dropdowns app-wide.
11. **Report generation**: select report type → filter (date range, branch) → run → **for CSV**, existing async job/download flow (already correct); **for Excel/PDF**, new generator implementing the existing `ExportGenerator` interface, same job/expiry/security pipeline.
12. **Member portal access**: already the best-built workflow in the system — invite → signed-URL accept → self-service dashboard/profile/QR/payments/receipts/attendance, all correctly scoped and IDOR-tested. No changes recommended.

---

## 19. Version 2 Implementation Roadmap

### Phase 0 — Critical Fixes and Stabilization

| Task ID | Module | Task | Priority | Dependencies | Complexity | Acceptance Criteria |
|---|---|---|---|---|---|---|
| P0-1 | Membership | Gate activation on `paid_in_full` (C-1) | Critical | — | Small | Sale/renewal with unpaid/partial invoice does not set `status=active`; test added |
| P0-2 | Membership | Exclude joining fee from renewal invoices (C-2) | Critical | — | Small | Renewal invoice total excludes joining fee; regression test for first-time sale still including it |
| P0-3 | Billing | Add confirm dialog + submit guard to refund UI (C-10) | High | — | Small | Refund requires explicit confirmation; double-click produces one refund |
| P0-4 | Billing | Fix billing sidebar navigation (C-11) | High | — | Small | Outstanding Balances and Collection Summary reachable from sidebar with correct permission gates |
| P0-5 | Dashboard | Wire real operational-stats endpoint (C-12) | Medium | P0-4 unrelated | Medium | "Today's operations" row shows real data, shape-adapted from `GET /api/v1/reports/dashboard/operational` |
| P0-6 | Report | Schedule `reports:expire-exports` (C-5) | Medium | — | Small | Command runs daily in `routes/console.php` |
| P0-7 | Cross-cutting | Add CI pipeline (`ci:check` + frontend equivalent) | High | — | Medium | PRs blocked on lint/types/test failures |

### Phase 1 — Core Business Logic

| Task ID | Module | Task | Priority | Dependencies | Complexity | Acceptance Criteria |
|---|---|---|---|---|---|---|
| P1-1 | Foundation | Enforce branch-level data isolation via a shared scope (C-3) | Critical | — | Large | Member/Membership/Staff/Branch list endpoints default to caller's assigned branches; tests added per module |
| P1-2 | Membership | Wire `membership_freezes` as real freeze history, or remove it (B-5) | Medium | — | Medium | Multiple freeze cycles queryable, or table/model removed |
| P1-3 | Membership | Consolidate `membership_events`/`membership_status_histories` delete semantics (B-6) | Medium | — | Small | Both tables share the same protection guarantee |
| P1-4 | Database | Enforce append-only on `PaymentEvent`, `NotificationDeliveryAttempt`, `MembershipStatusHistory` (C-8) | High | P1-3 | Small | Update/delete attempts throw; tests added |
| P1-5 | Database | Remove dead Billing sequence tables, correct architecture doc (C-9) | Medium | — | Small | Migration + doc updated, `billing_sequences` documented as authoritative |
| P1-6 | Billing | Wire `payment_allocations` for real per-item payment tracking, or remove | Medium | — | Medium | Invoice totals traceable to individual allocations, or table removed |
| P1-7 | Billing | Add tenant-level tax rate configuration | High | — | Medium | Gym profile has a default tax rate applied automatically to new invoices, overridable per-invoice |
| P1-8 | Billing | Cash drawer reconciliation workflow | High | — | Large | Open/close/count/reconcile flow with a daily report |

### Phase 2 — User Experience

| Task ID | Module | Task | Priority | Dependencies | Complexity | Acceptance Criteria |
|---|---|---|---|---|---|---|
| P2-1 | Frontend | Consolidate status badges through shared `StatusBadge` | Medium | — | Small | Members/Plans badges use the shared tone system |
| P2-2 | Frontend | Expand shared `DataTable` usage to all table-heavy pages | Medium | — | Large | Mobile card fallback present on Members/Memberships/Plans/Billing lists |
| P2-3 | Frontend | Add Members/Plans/Billing top-level nav permission gates | Medium | — | Small | Nav items hidden without the relevant `*.view` permission |
| P2-4 | Frontend | Promote Branches to a top-level nav item | Low | — | Small | Branches reachable in ≤1 click from any page |
| P2-5 | Audit | Expose full filter set in audit log viewer | Low | — | Small | All 8 backend filters available in the UI |
| P2-6 | Notification | Add live template preview | Low | — | Medium | Template editor renders sample-data substitution inline |
| P2-7 | Member | Client-side pre-validation + drag-drop for document upload | Low | — | Small | File-type/size errors surface before submit |

### Phase 3 — Security and Permissions

| Task ID | Module | Task | Priority | Dependencies | Complexity | Acceptance Criteria |
|---|---|---|---|---|---|---|
| P3-1 | Foundation | Add tenant scope to `User` model (C-7) | High | P1-1 (shares scope pattern) | Medium | `User::query()` is tenant-scoped by default; existing manual filters still pass |
| P3-2 | Member | MIME/extension allow-list + private storage for documents (C-14) | High | — | Medium | Non-allow-listed file types rejected; documents served via authenticated route |
| P3-3 | Foundation | Add `throttleApi()` and tune per-route limits (C-13) | Medium | — | Small | `/api/v1/*` requests rate-limited; tests assert 429 beyond threshold |
| P3-4 | Foundation | Tenant-scope `branch_id`/`branch_ids` validation (C-15) | Medium | — | Small | Cross-tenant branch IDs rejected in Member/Plan/Billing requests |
| P3-5 | Foundation | Fix unscoped Staff/Role web routes | Low | P3-1 | Small | Cross-tenant IDs 404 on web routes, matching API behavior |
| P3-6 | Foundation | Publish and review `config/cors.php`; force `SESSION_SECURE_COOKIE` in prod docs | Low | — | Small | Explicit, reviewed production config committed |
| P3-7 | AccessControl | Standardize on one authorization mechanism (Policy vs. Authorizer) | Medium | — | Large | All modules use the same pattern; `$this->authorize()` works uniformly |
| P3-8 | Audit | Extend `AuditLogger` coverage to Membership/Billing/Member/Plan/Branch/Gym (C-6) | High | — | Medium | Every mutating action in these modules writes an audit row; tests added |

### Phase 4 — Reports and Automation

| Task ID | Module | Task | Priority | Dependencies | Complexity | Acceptance Criteria |
|---|---|---|---|---|---|---|
| P4-1 | Notification | Integrate a real SMS and/or WhatsApp provider, or remove from UI (C-4) | High | — | Large | Configured channel actually delivers; delivery log reflects real provider status |
| P4-2 | Notification | Add listeners for `MembershipCreated`/`Frozen`/`Suspended`/`Cancelled` | Medium | — | Small | Notification fires for all 8 membership events, not just 4 |
| P4-3 | Notification | Payment/installment-due reminder automation | High | P1-6 (allocations) | Medium | Scheduled sweep dispatches reminders for overdue invoices |
| P4-4 | Notification | Birthday reminder automation | Medium | — | Small | Scheduled daily sweep dispatches on member birthdays |
| P4-5 | Notification | Inactive-member automation | Medium | — | Medium | Scheduled sweep flags members with no attendance in N days |
| P4-6 | Notification | Ship default rules/templates for new tenants | Medium | — | Small | Fresh tenant has working renewal/expiry reminders without manual setup |
| P4-7 | Report | Excel/PDF export generators | Medium | — | Medium | Both formats available via existing async export pipeline |
| P4-8 | Report | Scheduled report delivery via email | Low | P4-7 | Medium | Owner can subscribe to a recurring report email |

### Phase 5 — Testing and Production Readiness

| Task ID | Module | Task | Priority | Dependencies | Complexity | Acceptance Criteria |
|---|---|---|---|---|---|---|
| P5-1 | Testing | Concurrency/race-condition tests for payment/refund/attendance | High | — | Large | Parallel-request tests pass against real row-locking |
| P5-2 | Testing | Regression tests for P0-1/P0-2 | Critical | P0-1, P0-2 | Small | Tests fail on old code, pass on fixed code |
| P5-3 | Testing | Branch-isolation feature tests | High | P1-1 | Medium | Every affected endpoint has a branch-restriction test |
| P5-4 | Testing | Frontend page-level tests for financially sensitive pages | Medium | — | Large | Invoice creation, payment, refund pages covered |
| P5-5 | Testing | E2E golden-path suite (Playwright) | Medium | — | Large | Register → sell → pay → check in → renew passes headlessly in CI |
| P5-6 | Ops | Production queue worker documentation/config | High | — | Medium | Supervisor/Horizon config documented and tested |
| P5-7 | Ops | Load/perf baseline on Dashboard/Reports | Low | — | Medium | Baseline numbers documented before large-customer onboarding |

### Phase 6 — SaaS and Multi-Tenant Expansion

| Task ID | Module | Task | Priority | Dependencies | Complexity | Acceptance Criteria |
|---|---|---|---|---|---|---|
| P6-1 | Platform | Add plan-tier/trial/limit fields to `tenants` | Medium | — | Medium | Tenant subscription state is queryable and enforceable |
| P6-2 | Platform | Build a platform/super-admin panel | Medium | P6-1 | Very Large | Cross-tenant admin can view/manage customer tenants |
| P6-3 | Platform | Usage-limit enforcement (branches/staff/members per tier) | Low | P6-1 | Large | Actions blocked/warned when a tenant exceeds its tier's limits |
| P6-4 | Platform | System-level backup/restore and full-tenant data export | Medium | — | Large | A tenant's complete data can be exported/restored |
| P6-5 | Membership | Plan upgrade/downgrade with proration | Low | — | Large | Mid-cycle plan change computes a fair proration |
| P6-6 | Membership | Membership transfer between members | Low | — | Medium | A membership can move to a new member with full history preserved |
| P6-7 | Membership | Family/corporate/group memberships | Low | — | Very Large | A single billing entity covers multiple members |
| P6-8 | Membership | Trial memberships and day passes | Low | — | Medium | Short-duration, non-renewing membership types supported |

---

## 20. Top 20 Highest-Priority Actions

1. **Gate membership activation on `paid_in_full`** (C-1) — data-loss-adjacent revenue risk, active today.
2. **Exclude joining fee from renewal invoices** (C-2) — incorrect financial behavior, active today.
3. **Enforce branch-level data isolation** (C-3) — cross-branch privacy/security exposure, will surface the moment a multi-branch customer onboards.
4. **Add tenant scope to the `User` model** (C-7) — security risk matching a documented prior incident class in this exact codebase.
5. **Restrict member document upload types and secure storage** (C-14) — security risk, currently exploitable by any staff member with edit access.
6. **Add confirmation/guard to the refund action** (C-10) — broken core workflow risk (irreversible financial action, no safety net).
7. **Fix Billing's dead sidebar navigation** (C-11) — broken core workflow (front-desk/finance tools built but unreachable).
8. **Resolve or remove the fake SMS/WhatsApp channels** (C-4) — user frustration + commercial trust risk (advertised feature that silently fails).
9. **Extend audit logging to financial/membership mutations** (C-6) — security/accountability risk with no current recourse for disputes.
10. **Enforce append-only on the three unprotected "history" tables** (C-8) — data-integrity risk contradicting the system's own documented guarantee.
11. **Tenant-scope branch-ID validation** (C-15) — security risk, cross-tenant data association possible via crafted requests.
12. **Add API rate limiting** (C-13) — security/availability risk on the entire authenticated API surface.
13. **Add CI pipeline** — engineering maintainability risk; the existing good test suite currently provides no regression protection.
14. **Add concurrency/race-condition tests** — engineering/financial-integrity risk; the architecture depends on locking that's never been tested under real concurrency.
15. **Schedule `reports:expire-exports`** (C-5) — operational/storage risk, currently unbounded growth.
16. **Wire the real operational-stats dashboard endpoint** (C-12) — commercial value/first-impression risk; low effort, high visibility fix.
17. **Remove/correct the dead Billing sequence tables and documentation** (C-9) — engineering maintainability risk, actively misleading.
18. **Fix Members/Plans/Billing missing nav permission gates** (§8) — security/authorization risk (unauthorized users see nav entries they shouldn't).
19. **Add tenant-level tax configuration** — commercial value; every professional gym expects this and currently must re-enter tax on every invoice.
20. **Add cash drawer reconciliation** — commercial value for any gym taking cash, currently entirely unsupported.

---

## 21. Final Product Recommendations

The technical foundation here is genuinely good enough to build a sellable product on — that's the most important finding of this audit. The tenant-isolation model, the integer-cent financial ledger with real idempotency and immutability, and the attendance module's defense-in-depth eligibility logic are all the kind of infrastructure that's expensive to retrofit later and was done right the first time. That's worth more to a buyer than any single missing feature.

What will make gym owners choose this over a spreadsheet or a competing product is not a longer feature list — most competitors already have plan management and QR check-in. It's:

- **Trustworthy money handling.** Once C-1 and C-2 are fixed, this system will get every renewal and every activation right, every time, without a human double-checking. That's the actual sales pitch for "reduced manual work" and "accurate revenue tracking" — not that the features exist, but that an owner can stop personally auditing them.
- **A front desk that's fast under pressure.** The kiosk QR scanner, the member-portal self-service (which removes routine questions from front-desk queue entirely), and the "just registered → sell membership" quick-pick pattern already in today's uncommitted work are the right instincts — extend that pattern (expiring-soon quick-picks on renewal, per §18) rather than adding new screens.
- **Multi-branch operators who can actually trust branch boundaries.** Once §5 B-3 is fixed, this becomes a genuine differentiator: most small-gym software is single-location-first and bolts on multi-branch awkwardly. This system's tenant model already assumes multi-branch from the schema up — finishing the branch-isolation enforcement turns that architectural investment into a real selling point for chains.
- **Reports an owner actually believes.** The reconciliation-with-billing-ledger property (verified, not assumed) means the numbers in Reports will always match the numbers in Billing — a differentiator worth stating explicitly in sales materials once the dashboard's remaining stale placeholder (C-12) is fixed and every KPI on first login is real.
- **Reliable support for the staff turnover every gym has.** Fast onboarding (the invitation flow is genuinely well-built, tested, and secure) plus clear permission-gated navigation means a new front-desk hire can be productive same-day — worth calling out, since staff churn is a real operational pain point gym owners already know intimately.

None of this requires the SaaS-layer investment (§6/Phase 6) to start selling — a single-tenant or lightly-managed-multi-tenant pilot deployment is realistic once Phase 0 and the high-priority items in Phase 1/3 land. The subscription/platform-admin layer matters once you're selling to your fifth or fiftieth gym, not your first.
