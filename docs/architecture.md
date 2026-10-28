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
- `src/features/<name>/`: one product capability. Create `components/`, `model/`,
  `services/`, `schemas/`, `actions/`, or `hooks/` only as needed.
- `src/components/`: application shell and framework adapters, never a second UI kit.
- `src/lib/`: shared infrastructure with real consumers, never a business dumping ground.
- `src/config/`: typed, public configuration. Secrets belong in server-only modules.
- `src/contents/`: application translation catalogs with matching keys.
- `scripts/`: TypeScript repository tooling; `docs/adr/`: decisions and migration impact.

Use kebab-case filenames and directories, PascalCase component/type names, and named
exports except Next.js file conventions. Use `unknown` and runtime validation at
untrusted boundaries; retain strict TypeScript. Avoid mixed server/client barrels.

## Rendering and styling

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

Read root guidance, then only the scoped guidance and ADRs relevant to the touched
files. `npm run generate:feature -- billing` scaffolds a feature and its guidance.
New architectural layers need a small scoped `AGENTS.md`; do not repeat the root.
Accepted ADRs are historical records: supersede them with a new ADR.

`npm run check` covers formatting, lint, architecture, types, and tooling tests;
`npm run build` validates production routes and package consumption. Add feature
behavior tests and their CI command when business logic is introduced. Native Node
tests currently validate scaffolding; no application test runner is preselected.
