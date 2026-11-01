# Light and dark themes

The header's sun/moon button switches between **Light** and **Dark**. Light is the
default. The moon offers Dark; the sun offers Light. Accessible labels and tooltips
describe the action and are translated into English and Hindi. The control uses
the public `ThemeToggle` from `@software-system.design/ui/theme-toggle`.

The current policy is recorded in [ADR 0009](adr/0009-binary-theme-toggle.md), which
supersedes ADR 0008's earlier System option and dropdown. OS appearance changes do
not override the selected mode. No separate theme library is installed.

## Files and responsibilities

| File                                                          | Responsibility                                                                    |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `src/config/theme.ts`                                         | Allowed values, validation, storage key, and static bootstrap                     |
| `src/lib/stores/ui-store.ts`                                  | Per-provider theme state and `setTheme` action                                    |
| `src/components/providers/ui-store-provider.tsx`              | Browser restoration, subscriptions, document theme, and cross-tab synchronization |
| `src/components/providers/app-ui-provider.tsx`                | Connects the preference to the shared `UIProvider` theme and its token scope      |
| `src/components/preferences/theme-setting.tsx`                | Localized sun/moon control                                                        |
| `src/app/[locale]/layout.tsx`                                 | Server-rendered composition with a Light initial seed                             |
| `src/contents/en.json`, `src/contents/hi.json`                | Theme action labels                                                               |
| `src/config/theme.test.ts`, `src/lib/stores/ui-store.test.ts` | Validation/bootstrap behavior and store isolation                                 |

The shared UI package owns palettes, tokens, icon artwork, and generic control
behavior. The application owns the user's choice and browser lifecycle. Consume
public `--ssd-*` tokens instead of duplicating colors or targeting private classes.

## Saved preference

Only the `light` or `dark` enum is stored in localStorage under `ssd-ui-theme`.

| Event                                      | Result                                                   |
| ------------------------------------------ | -------------------------------------------------------- |
| First visit without a saved choice         | Light                                                    |
| Toggle the button                          | Update the document, UI scope, and saved choice          |
| Reload or change locale                    | Restore the saved theme                                  |
| Change theme in another same-origin tab    | Synchronize the active tab through the storage event     |
| Missing, invalid, or legacy `system` value | Interpret as Light                                       |
| Theme storage unavailable                  | Continue switching in memory; persistence is unavailable |

Display density has a separate lifetime: it remains memory-only and resets to
comfortable when its provider remounts. Theme changes do not persist density.
Adopters serving multiple apps on the same origin should choose an appropriate
storage namespace and agree with the host on document theme ownership.

## Rendering and hydration

Server Components remain server-rendered and pass the same deterministic Light
seed to each isolated provider. They do not inspect localStorage or read/write a
live Zustand store. The vanilla factory has no browser side effects.

On the initial document load, `AppUiProvider` emits a static bootstrap before its
visible children. It validates the saved value and applies it to both the document
and shared UI token scope before application content paints. The hidden static-HTML
slot avoids creating executable React script nodes during client navigation.

The provider's layout effect restores theme on mount/reactivation before paint,
then subscribes to theme changes and storage events. It updates the document's
`data-ssd-theme` and native `color-scheme`; `AppUiProvider` passes the same preference
to `UIProvider`. Subscriptions/listeners are removed on cleanup.

Shallow hydration suppression is limited to `html` and the UIProvider root div for
the expected pre-paint attribute changes. Child warnings remain visible. Bootstrap
content is static application code; never interpolate request or user content.
A deployment adding a restrictive CSP must allow the bootstrap through its nonce
or hash policy. See [ADR 0008](adr/0008-theme-preferences.md) for the persistence
and hydration design, with ADR 0009's updated binary choice/default.

## Validation

`npm run check` includes theme validation, bootstrap execution with saved/invalid
values and blocked storage, and independent store initialization. Run
`npm run build` for production compilation.

For browser verification, toggle both directions, confirm the action label/icon,
reload, switch locale using the footer dropdown, and change theme in another tab.
Inspect the document and UI scope for the same theme and check that there are no
hydration warnings. Verify that disabling theme storage still permits in-memory
switching and that a saved mode is applied before client chunks finish loading.

See [state management](state-management.md) for ownership, provider lifetime, and
the distinction between client preferences and server data.
