You are acting as a senior software architect, product engineer, UX specialist, security reviewer, QA engineer, and SaaS product consultant.

Your task is to perform a complete engineering and product audit of this Gym Management System and create a detailed document named:

`version2.md`

## Primary Objective

Read and understand the entire codebase before writing the document.

The purpose of `version2.md` is to identify everything required to transform the current system into a polished, secure, user-friendly, commercially successful Gym Management System that gym owners and staff will enjoy using.

Do not provide generic recommendations. Every finding must be based on the actual codebase, database structure, API implementation, UI, business logic, routes, components, workflows, and existing features.

## Important Rules

1. Do not immediately start writing the document.
2. First inspect and understand the full repository.
3. Do not modify the application code during this task.
4. Only create or update `version2.md`.
5. Ignore generated or dependency directories such as:

   * `node_modules`
   * `vendor`
   * `.next`
   * `dist`
   * `build`
   * storage caches
   * compiled assets
6. Do not assume a feature exists merely because a page, button, route, database table, or component exists.
7. Verify whether each feature is genuinely connected and working from the UI through the backend and database.
8. Clearly distinguish between:

   * Fully implemented
   * Partially implemented
   * UI only
   * Backend only
   * Placeholder or mock data
   * Broken
   * Missing
9. Mention exact file paths, classes, components, routes, controllers, services, models, migrations, or functions whenever possible.
10. Think like an engineer reviewing a product before selling it to hundreds or thousands of gyms.

## Phase 1: Understand the Existing System

Inspect the complete project, including:

* README files and project documentation
* Git structure and current branch
* Frontend architecture
* Backend architecture
* Database migrations and relationships
* Models and entities
* Controllers
* Services and repositories
* API routes
* Frontend routes
* Pages and layouts
* Reusable components
* Forms and validation
* Authentication
* Authorization and role permissions
* Dashboard
* Members
* Membership plans
* Membership activation
* Renewals
* Expirations
* Billing
* Payments
* Receipts
* Refunds
* Attendance
* Notifications
* Reports
* Exports
* Staff management
* Branch management
* Settings
* Audit logs
* Member portal
* Background jobs
* Scheduled tasks
* Tests
* Error handling
* Security configuration
* Deployment configuration

Trace the important workflows from beginning to end.

For example:

`Frontend form → API request → validation → controller → service → model/database → response → frontend state update → user feedback`

Do not judge a workflow only by its frontend appearance.

## Phase 2: Identify Missing Features

Find all important features that are missing from a professional Gym Management System.

Review the system from the perspective of:

* Gym owner
* Branch manager
* Receptionist
* Accountant
* Trainer
* Staff member
* Gym member
* System administrator
* Multi-branch business
* SaaS platform owner

Consider whether the system properly supports:

* New member registration
* Member profile management
* Emergency contacts
* Member documents
* Profile photographs
* Health notes and PAR-Q forms
* Membership plan configuration
* Joining fees
* Discounts
* Promotional offers
* Membership activation
* Membership freezing
* Membership pausing
* Membership cancellation
* Plan upgrades and downgrades
* Membership transfers
* Membership renewal
* Expiration management
* Grace periods
* Family or corporate memberships
* Trial memberships
* Day passes
* Outstanding balances
* Partial payments
* Payment methods
* Refunds
* Receipts and invoices
* Tax configuration
* Cash drawer reconciliation
* Attendance check-in and check-out
* QR attendance
* Rotating QR security
* Duplicate check-in prevention
* Branch access restrictions
* Membership validity checks
* Occupancy monitoring
* Staff attendance
* Notifications
* Automated renewal reminders
* Payment reminders
* Membership expiration alerts
* WhatsApp, SMS and email support
* Notification templates
* Reports
* Revenue analytics
* Attendance analytics
* Membership analytics
* Exporting to CSV, Excel or PDF
* Audit trails
* Role-based permissions
* Member self-service portal
* Branch management
* Staff management
* Gym settings
* Backup and recovery
* Data import
* Data export
* Subscription and tenant management

Only recommend features that make business sense. Explain why each missing feature is important.

## Phase 3: Find Bad Logic and Business Risks

Inspect the implementation for incorrect, incomplete, risky, or unrealistic business logic.

Look for problems such as:

* Membership activated without successful payment
* Expired members being allowed to check in
* Cancelled memberships remaining active
* Attendance recorded multiple times
* Incorrect membership date calculations
* Incorrect renewal calculations
* Incorrect payment balance calculations
* Negative totals
* Invalid discounts
* Refunds exceeding the original payment
* Hard-coded prices or statuses
* Incorrect timezone handling
* Incorrect branch filtering
* Members from one branch accessing another branch incorrectly
* Staff seeing data they should not see
* Deleted records breaking reports
* Reports calculating totals differently from billing
* UI status differing from backend status
* Race conditions
* Duplicate records
* Missing transactions
* Missing idempotency protection
* Missing database constraints
* Incorrect nullable fields
* Broken foreign-key relationships
* N+1 database queries
* Inconsistent enums or status values
* Controllers containing too much business logic
* Business rules duplicated across multiple files
* Frontend-only validation
* Weak backend validation
* Silent errors
* Buttons that do nothing
* Pages using mock data
* Forms that submit incomplete records
* Missing loading, success and failure states

For every problem, explain:

1. What is wrong
2. Where it exists
3. Why it is dangerous
4. A realistic scenario where it could fail
5. The recommended engineering solution
6. The priority level

## Phase 4: User Experience Audit

Review the system as if you were a receptionist using it during a busy gym period.

Identify confusing, slow, repetitive, or frustrating workflows.

Review:

* Sidebar organization
* Navigation labels
* Menu order
* Dashboard usefulness
* Search
* Filters
* Sorting
* Pagination
* Data tables
* Forms
* Dialogs
* Drawers
* Empty states
* Loading states
* Error messages
* Success feedback
* Confirmation dialogs
* Mobile responsiveness
* Tablet responsiveness
* Keyboard accessibility
* Color consistency
* Status badges
* Date pickers
* Currency formatting
* Number formatting
* Required fields
* Form field order
* Destructive actions
* Accessibility
* Screen-reader support
* Permission-based navigation
* Breadcrumbs
* Quick actions
* Global search
* Notifications
* Help text
* Onboarding

Identify areas where users must perform too many steps.

Recommend how important workflows can be completed faster, such as:

* Registering a new member
* Activating a membership
* Receiving a payment
* Renewing a membership
* Checking in a member
* Finding an overdue payment
* Printing or sending a receipt
* Freezing a membership
* Viewing a member’s complete history

The system should feel simple even when the underlying business rules are complex.

## Phase 5: Security Audit

Review the system for security problems, including:

* Authentication weaknesses
* Missing authorization
* Broken role checks
* Insecure direct object references
* Cross-tenant data leakage
* Cross-branch data leakage
* Weak password handling
* Exposed secrets
* Sensitive data in frontend code
* Missing rate limiting
* Missing API validation
* Mass assignment
* SQL injection risk
* Cross-site scripting
* CSRF protection
* Unsafe file uploads
* Missing audit logging
* Session problems
* Token handling
* Personal information exposure
* Receipt or invoice access without permission
* Unsafe exports
* Insecure QR attendance logic
* Missing ownership checks
* Destructive actions without confirmation
* Missing soft deletion or recovery

Never expose real secret values inside `version2.md`. Mention only the file and variable name when a potential secret is found.

## Phase 6: Architecture and Code Quality Audit

Review:

* Folder structure
* Separation of concerns
* Domain boundaries
* Service layer quality
* Controller complexity
* Component complexity
* Reusability
* Naming
* Type safety
* Error handling
* Logging
* Configuration
* Database normalization
* Indexes
* Query efficiency
* Caching opportunities
* Queue usage
* Scheduled jobs
* Event-driven logic
* API consistency
* Frontend state management
* Data-fetching strategy
* Testability
* Scalability
* Multi-tenant readiness
* Multi-branch readiness

Identify technical debt and explain how it will affect future development.

Recommend appropriate design patterns, but do not introduce unnecessary complexity.

## Phase 7: Testing and Reliability

Inspect the existing tests and identify missing coverage.

Recommend tests for:

* Authentication
* Permissions
* Member creation
* Membership activation
* Renewal
* Expiration
* Freeze and cancellation
* Payment creation
* Partial payments
* Refunds
* Attendance
* Duplicate check-ins
* Expired-member rejection
* Notifications
* Reports
* Branch isolation
* Tenant isolation
* API validation
* Error handling
* Database transactions
* Concurrent requests

Separate recommendations into:

* Unit tests
* Feature or integration tests
* API tests
* Frontend component tests
* End-to-end tests
* Security tests
* Performance tests

## Required Structure of `version2.md`

Create the document using the following structure:

# Gym Management System — Version 2 Engineering and Product Audit

## 1. Executive Summary

Provide an honest summary of:

* Current system maturity
* Strongest areas
* Weakest areas
* Main commercial risks
* Main technical risks
* Whether it is currently ready for production
* Whether it is currently ready to be sold to gyms

Include an approximate readiness score out of 100, based on evidence from the codebase.

## 2. Current Technology and Architecture

Document the technologies, folder structure, modules, architectural approach and major dependencies.

## 3. Existing Feature Inventory

Use a table with:

| Module | Feature | Status | Evidence | Notes |
| ------ | ------- | ------ | -------- | ----- |

Allowed statuses:

* Complete
* Partial
* UI Only
* Backend Only
* Mocked
* Broken
* Missing
* Unable to Verify

## 4. Critical Problems

Use a table:

| ID | Problem | Location | Business Impact | Recommended Fix | Priority |
| -- | ------- | -------- | --------------- | --------------- | -------- |

## 5. Bad or Dangerous Business Logic

Document each issue with:

* Current behavior
* Expected behavior
* Failure scenario
* Related files
* Recommended solution
* Required tests

## 6. Missing Essential Features

Group features into:

* Must Have Before Selling
* Must Have for Professional Gyms
* Advanced Competitive Features
* Future SaaS Features

## 7. User Experience Problems

Include:

* Existing problem
* Affected user
* Current number of steps
* Recommended workflow
* Expected benefit

## 8. Recommended Sidebar and Navigation

Recommend a clear sidebar structure and explain the reasoning.

A possible structure to evaluate is:

* Overview
* Members
* Memberships
* Attendance
* Billing
* Staff
* Operations
* Communications
* Reports
* Administration

Do not blindly use this structure. Base the final recommendation on the actual modules found in the codebase.

## 9. Security and Privacy Risks

Classify findings as:

* Critical
* High
* Medium
* Low

## 10. Architecture and Code Quality Improvements

Include file-level examples and recommended refactoring boundaries.

## 11. Database Improvements

Review:

* Tables
* Columns
* Relationships
* Constraints
* Indexes
* Status values
* Audit fields
* Soft deletes
* Tenant identifiers
* Branch identifiers
* Payment records
* Membership history
* Attendance uniqueness

## 12. API Improvements

Review:

* Route consistency
* Response structure
* Error format
* Validation
* Authorization
* Filtering
* Pagination
* Sorting
* Versioning
* Idempotency
* Rate limiting

## 13. Frontend Improvements

Review:

* Component organization
* Page structure
* Forms
* State management
* Data fetching
* Reusability
* Accessibility
* Responsiveness
* Performance
* User feedback

## 14. Reporting and Analytics Improvements

Recommend useful reports and explain what data each report requires.

## 15. Notification and Automation Improvements

Recommend event-driven automation for:

* Membership activation
* Upcoming expiration
* Expiration
* Missed payments
* Successful payments
* Attendance
* Birthdays
* Inactive members
* Failed notifications

## 16. Testing Strategy

Provide a practical test plan ordered by risk.

## 17. Production Readiness Checklist

Use checkboxes:

* [ ] Requirement

Include everything required before deploying the system for a paying gym.

## 18. Recommended Version 2 Workflows

Document ideal end-to-end workflows for:

1. New member registration
2. Membership activation
3. Payment collection
4. Membership renewal
5. Membership freeze
6. Membership cancellation
7. Member check-in
8. Refund processing
9. Staff account creation
10. Branch creation
11. Report generation
12. Member portal access

## 19. Version 2 Implementation Roadmap

Divide the work into phases.

For every task include:

| Task ID | Module | Task | Priority | Dependencies | Estimated Complexity | Acceptance Criteria |
| ------- | ------ | ---- | -------- | ------------ | -------------------- | ------------------- |

Use complexity values:

* Small
* Medium
* Large
* Very Large

Recommended roadmap sections:

* Phase 0 — Critical Fixes and Stabilization
* Phase 1 — Core Business Logic
* Phase 2 — User Experience
* Phase 3 — Security and Permissions
* Phase 4 — Reports and Automation
* Phase 5 — Testing and Production Readiness
* Phase 6 — SaaS and Multi-Tenant Expansion

## 20. Top 20 Highest-Priority Actions

Create a numbered list of the 20 most valuable actions, ordered by:

1. Data-loss risk
2. Security risk
3. Incorrect financial behavior
4. Broken core workflows
5. User frustration
6. Commercial value
7. Engineering maintainability

## 21. Final Product Recommendations

Explain what would make gym owners choose this system over spreadsheets or competing software.

Focus on real business value such as:

* Reduced manual work
* Faster front-desk operations
* Accurate revenue tracking
* Automated renewals
* Secure attendance
* Better member retention
* Clear reports
* Easy staff training
* Reliable support for multiple branches

## Quality Expectations

The final document must be:

* Specific
* Evidence-based
* Honest
* Technically accurate
* Product-focused
* Business-focused
* Well organized
* Actionable
* Detailed enough to guide development
* Easy for another engineer to understand
* Easy to convert into GitHub issues and development phases

Avoid vague recommendations such as:

* “Improve security”
* “Improve the UI”
* “Add more validation”
* “Optimize performance”

Instead explain exactly:

* What should change
* Why it should change
* Where it should change
* How it should work
* How to verify that it works

## Final Verification

Before finishing:

1. Recheck all major frontend and backend modules.
2. Verify that recommendations do not duplicate existing working features.
3. Verify that important findings include code references.
4. Confirm that the roadmap covers every critical issue.
5. Confirm that `version2.md` was created in the repository root.
6. Review the document for contradictions.
7. Ensure no secrets or passwords were copied into the document.
8. Run `git diff -- version2.md` and review the completed document.
9. Do not change any other files.

After completing the task, provide a concise terminal summary containing:

* Files inspected
* Major modules discovered
* Number of critical findings
* Number of missing features
* Number of UX improvements
* Number of security findings
* Location of `version2.md`
* Confirmation that no application code was modified
