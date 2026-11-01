# Architecture

This template is an independently built Next.js App Router microfrontend (MFE).
It does not prescribe a federation runtime or host deployment strategy.
[ADRs](adr/README.md) record the decisions; this document is the navigation map.

## Ownership and dependency direction

`app → features → components / lib / config / contents`.
Routes may also use the shared application layers directly. Application components,
infrastructure, configuration, and catalogs must not import routes or features.
Features must not import other features; compose them at a route or extract a shared
contract. Use `@/` for source imports and relative imports within a feature.

| Concern                                                                     | Owner                                               |
| --------------------------------------------------------------------------- | --------------------------------------------------- |
| Reusable controls, presentation, accessibility, UI behavior, themes, tokens | `@software-system.design/ui`                        |
| Routes, localization adapters, shell composition, framework integrations    | This MFE's `app/`, `components/`, `lib/`, `config/` |
| Business workflows, domain state, services, authorization                   | `features/<name>/`                                  |

Before adding a UI component, check the library's public exports and
[control dictionary](https://github.com/www-software-system-design/software-system-design-ui/blob/main/docs/ui-dictionary.md).
Use a public package subpath directly. Do not copy, re-export, or wrap a control merely
to rename it. Add generally reusable behavior to the library first and consume a
published version. An adapter is local only when it adds concrete routing or business
behavior. Plain semantic HTML and layout containers do not require a library abstraction.
A provisional local UI gap requires an ADR naming the owner and extraction plan.

## Scaffold

- `src/app/`: thin pages/layouts, metadata, route boundaries, global style entry.
- `src/app/api/**/route.ts`: HTTP adapters outside locale routing.
- `src/features/<name>/`: one product capability. Create `components/`, `model/`,
  `services/`, `schemas/`, or `hooks/` only as needed. Put Server Actions in a
  feature-level `actions.ts` module (ADR 0006).
- `src/components/`: application shell and framework adapters, never a second UI kit.
- `src/lib/`: shared infrastructure with real consumers, never a business dumping ground.
- `src/lib/stores/`: factories for app-wide public client preferences; feature stores
  stay feature-owned. `src/components/providers/` supplies mounted store lifetimes.
- `src/config/`: typed, public configuration. Secrets belong in server-only modules.
- `src/contents/`: application translation catalogs with matching keys.
- `scripts/`: TypeScript repository tooling; `docs/adr/`: decisions and migration impact.

Use kebab-case filenames and directories, PascalCase component/type names, and named
exports except Next.js file conventions. Use `unknown` and runtime validation at
untrusted boundaries; retain strict TypeScript. Avoid mixed server/client barrels.

## Rendering and styling

See [server implementation](server-implementation.md) and [ADR 0005](adr/0005-api-end-points.md)
for the Route Handler and Server Action contracts. Both call feature server-only
services directly and share validation. The message-preview example is public and
stateless; authentication and persistence remain product choices.

Pages/layouts stay Server Components. Add `"use client"` at the smallest interactive
boundary. Library controls are Client Components and can receive serializable props
from a server; event callbacks belong inside a client adapter. Use `server-only`
for credentials, private data, and privileged operations. Read the installed Next.js
guides before changing routing, fetching, caching, or invalidation.

The locale layout mounts one scoped `UIProvider` with matching SSR locale and direction.
Import library CSS once through `app/globals.css`, after Tailwind. Use public
`--ssd-*` tokens for shared styling; utilities compose layout. Do not target private
library selectors or duplicate its palette. Supply translated labels/messages for
controls in use; library fallbacks are English. State stays local first; use URL
state for shareable navigation. Add stores or query clients only for a concrete need.

Every page supplies one `main#main-content` for the skip link. Preserve semantic HTML,
keyboard focus, and useful localized loading/error/empty states. Never show raw
exceptions or secrets.

## Guidance and validation

Zustand supplies app-wide mutable client preferences (ADR 0007). The locale layout
creates a provider scope; the header density control and `AppContent` select from
the same instance. RSCs pass serializable seeds and children, never read/write the
live store. API/action validation and data ownership remain on the server.
See [state management](state-management.md) for scope, hydration, persistence,
selectors, alternatives, and feature store placement.
ADR 0008 adds theme-only persistence; ADR 0009 selects the sun/moon Light/Dark
control with Light as default.
`AppUiProvider` connects it to shared UI tokens; a static validated bootstrap
apply document/scope preferences before hydration. The app owns persistence and
document integration, while the shared library owns palettes and generic controls.

Read root guidance, then only the scoped guidance and ADRs relevant to the touched
files. `npm run generate:feature -- billing` scaffolds a feature and its guidance.
Add `--server-actions` to include an `actions.ts` scaffold. Export named async
`<verb><Entity>Action` functions; state/contracts stay in model, forms in components,
and pages render the forms. See [ADR 0006](adr/0006-server-action-conventions.md).
New architectural layers need a small scoped `AGENTS.md`; do not repeat the root.
Accepted ADRs are historical records: supersede them with a new ADR.

`npm run check` covers formatting, lint, architecture, types, tooling and server feature tests;
`npm run build` validates production routes and package consumption. Add feature
behavior tests and their CI command when business logic is introduced. Native Node
tests validate scaffolding, server services, actions, and store behavior; browser tests can be added
when a product requires them.
