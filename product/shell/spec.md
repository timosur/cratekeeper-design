# Application Shell Specification

## Overview

A persistent left-sidebar shell that frames every Cratekeeper view. The shell stays out of the way of the main work surface (event detail rails, tables, audit log) while keeping global navigation, job activity, system health, and the operator's quick-create action one click away. It mirrors the "focused engineering workbench" personality of the design system — calm, precise, dense, and trustworthy.

## Navigation Structure

A vertical sidebar with a fixed 240px width on desktop. From top to bottom:

1. **Brand block** — `Cratekeeper` wordmark (Inter 600) with a small build/version tag.
2. **Primary CTA** — `+ New Event` button (sky primary, full width).
3. **Primary nav** (in roadmap order):
   - Dashboard → `/`
   - Event Detail → `/events/$id` (only highlighted when an event is open)
   - Settings → `/settings`
   - Master Library → `/library`
   - Audit Log → `/audit`
4. **System status block** (separator above):
   - Job activity row — running jobs count + spinner, queued count, link to job stream
   - Connection status row — API + SSE health dots (emerald = connected, neutral = idle, red = disconnected)
5. **User menu** at the bottom of the sidebar — avatar + display name + chevron, opens a dropdown with: Theme toggle (light/dark), Open data folder, Log out.

The active route gets a sky-tinted background (`bg-sky-50 dark:bg-sky-950/40`), a sky-600 left border accent, and sky-700 text. Inactive items hover to a neutral surface.

## User Menu

- **Location:** bottom of the sidebar (compact dropdown opens upward).
- **Contents:** circular avatar (initials fallback), display name in body weight, role/email in micro caption, chevron icon. Dropdown actions: theme toggle, open `~/.cratekeeper/`, log out.

## Layout Pattern

A two-column shell:

- **Left column** — fixed 240px sidebar with the navigation, system status, and user menu described above. Uses a slightly raised neutral surface (`bg-neutral-50 dark:bg-neutral-950`) with a 1px right border (`border-neutral-200 dark:border-neutral-800`).
- **Right column** — the work surface. Sticky 56px top bar containing the current view's title slot (set by each section), a contextual breadcrumb when nested (e.g. `Events › Sarah & Mike's Wedding`), and a slot for per-page actions on the right.
- Below the top bar, content flows in a comfortably padded container (`px-8 py-6`) with no max-width — sections like the audit log and job tables benefit from the full viewport.

## Responsive Behavior

This is a desktop-first operator tool intended to run on a Mac. The shell is optimised for ≥ 1280px viewports.

- **Desktop (≥ 1280px):** full sidebar visible, two-column layout as described.
- **Narrow desktop (1024–1279px):** sidebar collapses labels to icons (64px wide), tooltips on hover. User menu becomes a single avatar button.
- **Below 1024px:** layout is unsupported by design; a plain notice banner suggests opening on a wider screen.

## Design Notes

- Typography: Inter for all UI text, JetBrains Mono for any identifier or count (running job count, version, build hash). Heading weights stay at 600; body at 400.
- Color use: sky is the only chromatic accent and appears on the active nav item, the New Event CTA, and focus rings. Emerald appears only as the "healthy" status dot. All other surfaces are neutral.
- Borders: 1px neutral borders are used liberally per the utilitarian UI style preference (separators between nav groups, the top bar, the sidebar's right edge).
- Shadows: only the user-menu dropdown gets a subtle elevation shadow; the shell itself is flat.
- Density: the sidebar uses 36px row heights for nav items; the top bar is 56px tall.
- Section screen designs render inside the right column without their own navigation chrome.
