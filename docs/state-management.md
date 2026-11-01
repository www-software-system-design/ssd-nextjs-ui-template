# State management with Next.js

Zustand is the selected shared **client-state** tool for this template. It works
with SSR and Next.js when store instances are scoped to a mounted provider and
initialized deterministically. Server Components own server reads; they do not read
or mutate the live client store. There is no single mutable store shared between
the server and browser.

The implementation follows the [Zustand Next.js guide](https://zustand.docs.pmnd.rs/learn/guides/nextjs)
and installed Next.js server/client composition guide. The upstream Zustand guide
notes that it is being revised; this template uses its factory, isolation, and
provider principles with stable APIs. Zustand 5.0.16 is pinned and supports the
repository's React 19.3.0, Node 26.13.0, and TypeScript versions.

## Choose the owner before choosing a store

| State                                                | Owner in this repository                                 |
| ---------------------------------------------------- | -------------------------------------------------------- |
| Component-local interactions                         | React `useState` / `useReducer`                          |
| Shareable filters, pagination, selected resource     | URL search parameters or route segments                  |
| App-wide mutable display preferences                 | Provider-scoped Zustand UI store                         |
| Feature-shared client drafts/selections              | A factory/provider inside that feature, only when needed |
| Server Action result, pending state, field errors    | React `useActionState` / `useFormStatus`                 |
| Authoritative business data and authorization        | Server services and the selected database/API            |
| Client-side remote-data caching, polling, refetching | Consider TanStack Query when an actual consumer needs it |

Zustand fits this application's small mutable preference store. Redux Toolkit is
also valid for applications wanting an explicit action/reducer architecture across
larger workflows; its [Next.js guidance](https://redux.js.org/usage/nextjs) also
requires store isolation and keeps RSCs outside the live store. A simple React
context can be sufficient when selector-based subscriptions are unnecessary.
[TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
addresses server-data synchronization and can complement client state. No tool
removes the server/client boundary or is universally best for every kind of state.

## Current files and flow

```text
src/lib/stores/ui-store.ts                         Typed vanilla store factory
src/lib/stores/ui-store.test.ts                    Isolation and snapshot tests
src/components/providers/ui-store-provider.tsx     Client provider and selector hook
src/components/providers/app-ui-provider.tsx       Shared UI theme integration
src/components/preferences/theme-setting.tsx      Sun/moon Light/Dark toggle
src/config/theme.ts                              Preference validation and static bootstraps
src/components/preferences/display-density-control.tsx
                                                  Header preference control
src/components/app-content.tsx                    Applies spacing to application main content
src/app/[locale]/layout.tsx                        Server-rendered provider composition
```

`createUiStore` creates a new vanilla store on each call. Its initial preferences
are plain serializable data; the factory adds action functions internally. There
is no module-level store instance.

The Server Component locale layout renders this composition:

```tsx
<UiStoreProvider
  key={locale}
  initialState={{ density: "comfortable", theme: "light" }}
>
  {/* AppUiProvider, header, and footer live inside this scope. */}
  <AppContent>{children}</AppContent>
</UiStoreProvider>
```

The Client Component provider uses a lazy `useState` initializer so it retains one
store instance throughout its mounted lifetime. SSR and the first client render
receive the same initial preferences. RSC children are passed through the provider;
this does not turn their source modules into Client Components. See
[Next.js composition guidance](https://nextjs.org/docs/app/getting-started/server-and-client-components).

Client adapters select just the fields/actions they use:

```tsx
"use client";

import { useUiStore } from "@/components/providers/ui-store-provider";
import { Button } from "@software-system.design/ui/button";

export function CompactViewToggle({ label }: { label: string }) {
  const density = useUiStore((state) => state.density);
  const setDensity = useUiStore((state) => state.setDensity);
  return (
    <Button
      type="button"
      aria-pressed={density === "compact"}
      onClick={() =>
        setDensity(density === "compact" ? "comfortable" : "compact")
      }
    >
      {label}
    </Button>
  );
}
```

Avoid subscribing to the entire store when only one field is needed. Select stable
scalar values and action references. If selecting a freshly created array/object,
use Zustand's documented `useShallow` approach or separate selectors to keep the
snapshot stable. Keep derived values derived rather than duplicating them in state.
The hook throws a clear error if used outside its provider.

## Preference lifetime and rendering

The header's localized **Compact view** button toggles `density` and exposes its
state with `aria-pressed`. `AppContent`, a separate client consumer, applies
comfortable or compact vertical spacing to semantic application `main` content.
It leaves shared-library control internals to the UI package.

The density preference lasts through client navigation under the same locale layout.
Reloading, switching locale, or remounting the provider initializes comfortable
mode again. Different provider trees and SSR renders have independent instances.
A new `initialState` object passed to an already mounted provider does not overwrite
the current preference; use an explicit action or a new provider key for a deliberate reset.

Density is memory-only. Theme uses the explicit persistence design in
[ADR 0008](adr/0008-theme-preferences.md), with the binary control/default in
[ADR 0009](adr/0009-binary-theme-toggle.md): `light` is the deterministic SSR seed;
`light` or `dark` is restored from the `ssd-ui-theme` localStorage key in
the provider's layout effect. The scope/provider use the library's public theme
tokens. The shared `ThemeToggle` supplies the sun/moon icons, button semantics,
localized action label, and tooltip. Explicit theme choices stay fixed across OS
color-preference changes. Legacy `system` values fall back to Light.
The [theming guide](theming.md) documents the current behavior, source files,
persistence lifecycle, and validation steps together.

`AppUiProvider` places a static, validated bootstrap at the start of its token scope
to apply both document and scoped theme before its content paints. The script is
emitted through a hidden static-HTML slot, so React does not create script elements
during client navigation; the layout effect handles those remounts. Narrow
`suppressHydrationWarning` props cover the expected theme attributes on `html` and
that provider's root div; child hydration warnings remain visible. The bootstrap
contains no request/user text. Do not interpolate untrusted values into it. A future
strict CSP must allow the bootstrap with the deployment's nonce/hash strategy.

The live Zustand factory still receives identical public seed values on the server
and first client render. After mounting, the provider restores theme, subscribes
only to theme changes for persistence, and synchronizes cross-tab storage events.
Storage failures retain a working in-memory setting. A reload or locale remount
restores saved theme while resetting density. This localStorage preference is
public presentation data, not an authentication or authorization mechanism.

## Server Components, APIs, and Server Actions

Server Components may fetch data from server services and pass safe serializable
initial data to a client provider. They must not call the selector hook, access a
shared store instance, or mutate a browser store during render. Do not pass store
APIs or action functions as ordinary initial-data props across the RSC boundary.

Route Handlers and Server Actions keep validation, authentication, authorization,
and durable writes on the server. A client preference is untrusted UI data and must
never establish permissions or identity. A client component can consume an API or
action result and explicitly update its store when that result should affect UI
preferences; server writes and Next.js cache invalidation do not synchronize a
Zustand store automatically.

The existing message-preview form keeps its pending/result state in `useActionState`.
Its endpoint and action call the feature-owned oRPC procedure directly, which delegates
to the server-only service (ADR 0010); neither reads the UI store. See [server implementation](server-implementation.md).

## Adding state

Add app-wide public preferences to `UiPreferences`/`UiStore` only when there are real
application consumers. Keep business/domain state in a feature-owned store factory,
provider, and hook. Mount feature providers near their consumers; a page-level
provider resets on unmount, while a shared-layout provider lasts through navigation
under that layout. Keep stores independent of unrelated features and avoid global
barrels that mix client hooks with server services.

The feature generator includes these ownership rules in its guide; it does not
create an unused store/provider in every new feature. Use the existing app store
as a reference for request isolation and typed selectors, not as a place to put all
feature data. [ADR 0007](adr/0007-zustand-client-state.md) records the decision.

## Validation

Run `npm run test:state` for instance isolation, matching initial snapshots,
unchanged seed data, action references, and subscription cleanup. This runs through
`npm test`, `npm run check`, and CI. Native tests also validate the theme bootstrap
with saved/invalid values and blocked storage. They do not mount React or prove
browser hydration.

After format, check, and build, smoke-check the running app: toggle compact mode,
verify spacing and pressed state, navigate between `/en` and
`/en/examples/message-preview`, and reload to confirm the documented reset.
Repeat for Hindi to verify the localized label and locale-reset behavior. Check
the browser console for hydration errors. Test API/action behavior independently;
the density preference should affect only page spacing.
