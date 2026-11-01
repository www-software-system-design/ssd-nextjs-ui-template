# ADR 0009: Sun/moon theme toggle

- Date: 2026-11-01
- Status: Accepted
- Supersedes: ADR 0008 for theme choices, control, and default

## Context

The requested theme control is a sun/moon button with Light and Dark choices.

## Decision

Consume the shared UI package's public `ThemeToggle` in the existing theme adapter.
Light is the default; the moon switches to Dark and the sun switches to Light.
Translate action labels/tooltips in English and Hindi. Restrict the persisted enum
to light/dark and use Light for missing, invalid, or legacy system values.

Keep ADR 0008's persistence, pre-paint initialization, scoped UI integration, and
cross-tab synchronization. No new dependency or generic visual implementation is needed.

## Alternatives and consequences

The three-choice dropdown is superseded by the requested binary control. Explicit
choices no longer follow OS changes. Existing saved Light/Dark values are preserved.

## Migration and validation

Use a Light SSR seed and update enum/bootstrap validation tests. Run format, check,
and build; verify button labels/icons, both directions, reload persistence, locale
navigation, and hydration behavior in Chrome.
