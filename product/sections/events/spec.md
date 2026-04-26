# Dashboard Specification

## Overview

The Dashboard is the operator's home — a card grid of all active events, each surfacing where it is in the 11-step pipeline at a glance. It's optimized for the question "what needs my attention?" so the DJ can spot a stuck job, a stale build, or an event still mid-pipeline without opening every event.

## User Flows

- Operator lands on `/`, sees every active event as a card and can identify any that need action (failed job, stale build, build pending) at a glance.
- Operator clicks the `+ New Event` button (top-right of the dashboard), fills in event name + date + Spotify playlist URL in a modal, and submits — the new event appears as a card and the operator is navigated into its Event Detail.
- Operator clicks anywhere on an event card to navigate to that event's Event Detail page.
- Operator sees a card with a failed or paused job and clicks the inline "Resume" action on the card to restart from the last checkpoint without leaving the dashboard.
- When no events exist, operator sees an empty-state illustration with a brief explainer and a primary "Create your first event" CTA.

## UI Requirements

- **Page header:** title "Events" on the left, primary `+ New Event` button on the right (sky CTA).
- **Card grid:** responsive 1 / 2 / 3 columns based on viewport width; cards are uniform height, comfortably padded, with `rounded-md` corners and a 1px neutral border.
- **Card contents (top to bottom):**
  - Event name (Inter 600, prominent) and event date (caption, neutral-500)
  - Slug shown small in JetBrains Mono; Spotify playlist URL truncated with an external-link icon
  - Current step badge (e.g. "Analyze Mood — step 7 of 11") with a thin segmented progress bar showing completed / current / remaining steps
  - Track counts row: `total / matched / tagged` in JetBrains Mono with subtle dividers
  - Status pills row: active job badge (sky for running, neutral for queued, red for failed) and a stale-build warning pill (amber) when applicable
  - Footer row: last activity timestamp ("Updated 12 min ago") on the left; inline "Resume" action on the right when a job is failed or paused
- **Card interactions:** entire card is the click target for opening the event; the inline Resume action is its own button that doesn't trigger navigation. Hover lifts the card with a subtle shadow and shifts the border to neutral-300.
- **New Event modal:** simple form with event name, date picker, Spotify playlist URL field; primary submit + cancel.
- **Empty state:** centered block with a small illustration, a one-sentence explainer ("Pull a Spotify playlist and turn it into a tagged, sorted event folder."), and a sky `+ Create your first event` CTA.
- **Out of scope:** editing event details inline, drilling into job logs, cross-event analytics or charts, Anthropic cost view (lives in Settings).

## Configuration

- shell: true
