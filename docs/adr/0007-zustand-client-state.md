# ADR 0007: Zustand for shared client preferences

- Date: 2026-11-01
- Status: Accepted
- Supersedes: ADRs 0002 and 0004 only where they defer selecting a shared client-state library

## Context

The user requested Zustand and chose app-wide UI preferences as the first consumer.
The application needs shared mutable density state across client navigation while
retaining Server Components, request isolation, and the current API/action boundaries.

## Decision

Pin stable Zustand 5.0.16 and commit the lockfile. Use `zustand/vanilla` store
factories with a Client Component context provider and typed `useStore` selectors.
Create one instance with a lazy initializer per mounted provider. Never export a
module-level store instance or access the live store from RSCs, handlers, or actions.
Server Components pass public serializable initial preferences and rendered children.
The same initial values must produce SSR HTML and the first client render.

Place app-wide UI preference factories under `src/lib/stores/`; framework providers
under `src/components/providers/`; and preference controls under
`src/components/preferences/`. Keep domain stores within their owning feature and
mount them at the narrowest scope that meets their lifetime needs. Do not add unused
stores to feature scaffolds; generated guidance links to this decision.

The locale layout mounts `UiStoreProvider`, keyed by locale, with comfortable
density. The header toggle and `AppContent` share selectors from that store.
Density changes application page spacing rather than shared-library internals.
Keep this preference in memory: it survives navigation under the mounted provider
and resets on reload, locale remount, or provider remount. A changed seed prop alone
does not reset an existing store. No browser persistence, cookies, or devtools middleware
are selected without a requirement.

Server records, authentication, API/action validation, form submission state, and
cache invalidation keep their current owners. Zustand is not a shared memory channel
between the server and browser, nor a server-data cache.

## Alternatives

- Local React state/context: suitable for local or simple shared state. Zustand is
  selected here for the requested explicit store and selector-based subscriptions.
- Redux Toolkit: a valid option for applications needing a larger standardized
  action/reducer architecture; the current preference does not need that machinery.
- TanStack Query: consider for client-side server-data caching/refetching, not as the
  owner of a display preference. Do not install it until a consumer requires it.
- A module singleton: rejected because SSR requests could observe shared mutable state.
- localStorage persistence by default: rejected because it adds hydration and lifecycle
  decisions that this memory-only preference does not require.

## Consequences

The application gains one production dependency and a concrete shared-state consumer.
Pages/layouts remain Server Components, and feature ownership stays intact. Each
provider instance isolates its state and requires an explicit seed/lifetime design.
Zustand 5 supports React 18+ and Node 12.20+; the repository's React 19.3.0, Node
26.13.0, and strict TypeScript configuration meet the package requirements. No
prerelease APIs or additional middleware dependencies are introduced.

## Migration and validation

Run `npm ci` after the package/lockfile update. Use the header's localized density
toggle, navigate between the starter and message-preview pages, then reload to verify
the declared lifetime. Existing API and action behavior stays unchanged.

`npm run test:state` checks store isolation, stable initialization snapshots, seed
immutability, and subscription cleanup; it runs through `npm test`, check, and CI.
Run format, check, and build. Native store tests do not verify browser hydration,
visual spacing, ARIA toggle interaction, or client navigation; smoke-check those in
the running app when the environment permits it.

References: [Zustand Next.js setup](https://zustand.docs.pmnd.rs/learn/guides/nextjs),
[stable release](https://github.com/pmndrs/zustand/releases/tag/v5.0.16),
[package compatibility](https://github.com/pmndrs/zustand/blob/v5.0.16/package.json),
[Next.js server/client composition](https://nextjs.org/docs/app/getting-started/server-and-client-components),
[Redux Next.js guidance](https://redux.js.org/usage/nextjs), and
[TanStack Query SSR guidance](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr).
