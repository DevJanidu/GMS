# Integration Notes — phase-1/gym-staff-rbac

Notes for Worktree 1 (`phase-1/ui-shell`) and the Phase 1 integration merge.
Per SRS Rule 2, this worktree does not modify Worktree-1-owned shared files
directly; the changes below still need to be applied by Worktree 1 or during
integration.

## Sidebar navigation

`resources/js/components/app-sidebar.tsx` / `nav-main.tsx` currently have a
hardcoded nav list. The following pages need entries (all permission-gated):

| Label     | Href            | Permission     |
| --------- | --------------- | -------------- |
| Branches  | `/branches`     | `branches.view`|
| Staff     | `/staff`        | `staff.view`   |
| Roles     | `/roles`        | `roles.view`   |

## Settings sidebar

`resources/js/layouts/settings/layout.tsx` has a hardcoded
`sidebarNavItems` list (Profile / Security / Appearance). Add:

| Label | Href            | Permission  |
| ----- | --------------- | ----------- |
| Gym   | `/settings/gym` | `gym.view`  |

## `resources/js/lib/api/client.ts`

This worktree needed a frontend API client before Worktree 1 had published
one (the file didn't exist yet). Added a minimal, dependency-free `fetch`
wrapper (no axios/React Query, since neither is in `package.json` and this
worktree doesn't own that file). It exposes `apiClient.get/post/put/patch/delete`
returning `{ success, data, message?, meta? }` and throws `ApiRequestError`
(with `.status` and `.errors`) on failure. All Branch/Staff/Roles/Gym pages
depend on this file. Worktree 1 should review and relocate/replace it if a
different frontend data-fetching standard is adopted (e.g. React Query) —
the module `api/*.ts` files each wrap it narrowly, so swapping the
underlying client should be a contained change.

## New `components/ui/textarea.tsx`

Added a standard (unmodified) shadcn `Textarea` primitive — used by the Gym
settings page, wasn't in the initial shadcn set. Plain addition to the
existing `components/ui/*` primitive library, no new npm dependency.

## Backend module route auto-loading

`routes/web.php` now also globs `app/Modules/*/web.php` for Inertia page
routes, alongside the existing `routes/api.php` module auto-loading. Any
future module adding pages should add its own `web.php`.

## Permission catalog

Permission slugs and the default system roles (Owner / Manager / Front Desk)
are seeded via `PermissionSeeder` / `RoleSeeder` (called from
`DatabaseSeeder`). `App\Modules\AccessControl\Support\PermissionCatalog` is
the single source of truth for slugs — add new permissions there.

## Known gaps / not yet wired

- No shared `DataTable`, `ConfirmationDialog`, or `Pagination` component
  exists yet (per SRS these are Worktree-1-owned `components/shared/**`).
  Branch/Staff/Role list pages use a plain HTML table and `window.confirm()`
  as a placeholder; list pages currently load a single page (branch/staff
  API endpoints support `?page=`, but the pages don't yet expose pager UI).
  Worth revisiting once the shared DataTable exists.
- Staff invitation emails use the `log` mail driver in local/dev — check
  `storage/logs/laravel.log` for the invite link when testing manually.
