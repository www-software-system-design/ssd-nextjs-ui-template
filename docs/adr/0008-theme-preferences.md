# ADR 0008: Persistent light, dark, and system themes

- Date: 2026-11-01
- Status: Accepted
- Supersedes: ADR 0007 only where it defers persistence for the public theme preference

## Context

The app needs an explicit theme setting in addition to its existing system-derived
palette. The shared UI package owns colors and supports light/dark/system scopes;
the app owns the user's preference and its browser lifecycle. Cache Components,
localized layouts, and SSR require a deterministic first React render.

## Decision

Add the typed `theme` preference and `setTheme` action to the isolated Zustand UI
store. Default to `system`; use the package's public `SelectField` for localized
System, Light, and Dark choices. `AppUiProvider` connects store state to the public
`UIProvider` theme prop. Do not duplicate palettes, generic controls, or domain state.

Persist only the validated theme enum in localStorage under `ssd-ui-theme`. Restore
it in the client's layout effect before paint on mount/reactivation, subscribe to
theme changes, and synchronize native cross-tab storage events. Keep the vanilla
factory browser-independent and use identical initial values during SSR and initial
hydration. Density remains memory-only. Storage failures leave an in-memory control.

Apply theme to both the document and shared UI token scope. A static bootstrap at
the beginning of the UIProvider scope validates the stored enum and applies both
document theme/color-scheme and scoped tokens before its children paint. Emit it
through a hidden static-HTML slot: it executes during document parsing without
creating React script nodes on client navigation. The layout effect restores theme
before paint on client remounts. React still hydrates from the deterministic
system seed, then adopts the stored preference through the live store. Only html
and the provider scope div receive shallow `suppressHydrationWarning` for these
expected attribute changes; do not suppress child hydration errors.

Script strings contain only static constants, never request/user text. A strict CSP
deployment must supply its own inline-script nonce/hash policy. System mode uses
the library's prefers-color-scheme CSS and the document's `color-scheme: light dark`;
no JS media listener or duplicate resolved-theme state is needed.

## Alternatives

- Session-only theme: rejected because explicit preferences should survive visits.
- Cookie-derived root rendering: possible, but would add request-time data/Suspense
  decisions to the static Cache Components layout for a presentation preference.
- next-themes: the current stable release is 0.4.6; its public tracker reports a
  stale-theme problem with Cache Components and locale navigation (#375). It would
  also require adapting document state to this library's separately scoped provider.
  The existing store plus narrow app integration is sufficient here.
- Zustand persist for the entire UI store: rejected because it would change density
  lifetime and couple future fields to persistence. Theme persistence is explicit.

## Consequences

The header exposes all three theme choices and remembers the choice across reloads
and locale changes. The shared package remains the sole palette owner. The app owns
document theme attributes and browser storage; embedded MFEs must agree with their
host on that ownership and storage namespace. No new dependencies or prerelease
APIs are required. The UI library's ThemeToggle supports binary themes; SelectField
provides the required system option without recreating a reusable control.

## Migration and validation

Existing visitors start in System mode. A valid stored choice wins after mounting;
invalid/missing data defaults to System. Add `theme: "system"` to provider seeds.
Do not use browser state to authorize server operations.

Run format, check, build, and browser checks for light/dark overrides, system media
changes, reloads, locale navigation, cross-tab synchronization, and blocked storage.
Native tests cover preference validation, bootstrap execution/failure handling,
and store isolation. The browser check must also inspect document and provider token
scope agreement and console hydration errors.

References: [Next.js server/client composition](https://nextjs.org/docs/app/getting-started/server-and-client-components),
[Zustand Next.js guidance](https://zustand.docs.pmnd.rs/learn/guides/nextjs),
[next-themes current release](https://github.com/pacocoursey/next-themes/releases/tag/v0.4.6),
and [Cache Components issue](https://github.com/pacocoursey/next-themes/issues/375).
