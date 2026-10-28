# Next.js microfrontend template

Foundation for independently built software-system.design MFEs: Next.js App Router,
React, strict TypeScript, Tailwind, and published `@software-system.design/ui` by default.

## Start

Use Node.js 24 and npm (`npm.cmd` on PowerShell if script execution is disabled).

```sh
npm ci
npm run dev
```

Open http://localhost:3000; the locale proxy redirects to English or Hindi according
to the first supported language preference. No secrets or authentication setup is
required. Copy `.env.example` to `.env.local` when adding application configuration.

## Create a microfrontend

1. Create a repository from this template; rename `package.json` and update
   `src/config/site.ts`. Run `npm install --package-lock-only` after renaming.
2. Read [architecture](docs/architecture.md), the [ADR index](docs/adr/README.md), and
   applicable `AGENTS.md` files. Retain these files in the new repository.
3. Run `npm run generate:feature -- billing` (use your capability name). It creates
   feature and component guidance without overwriting existing files. Update the
   feature guide with its domain, entry routes, contracts, and test command.
4. Replace the `starter` feature and compose the new feature from a thin route.
   Update catalogs, locales/directions, metadata, favicon, and application copy.
5. Select authentication, APIs, persistence, feature tests, and host/deployment
   integration when needed. Document environment variables and validate boundaries.
6. Run `npm run check` and `npm run build`. Enable branch protection requiring the
   CI quality job. Add application test commands to CI with the first behavior tests.

Creating a repository copies the committed guidance/ADRs; it does not synchronize
future template changes. Adopt later changes through reviewed pull requests.

## UI ownership

Generic controls and reusable visual behavior come from the shared package:

```tsx
import { Button } from "@software-system.design/ui/button";
```

Use controls directly. The locale layout supplies `UIProvider`, locale/direction,
and the messages currently used. `src/app/globals.css` imports library CSS once,
after Tailwind. Add translated provider messages as more controls are introduced.
Use public `--ssd-*` tokens; keep Tailwind for composition.

Before creating UI, check the library's
[control dictionary](https://github.com/www-software-system-design/software-system-design-ui/blob/main/docs/ui-dictionary.md)
and public exports. Reusable components belong in the library and arrive here through
a published release. Feature-specific business components stay in their feature.
Next.js adapters such as localized navigation stay in `src/components/`. See
[ADR 0001](docs/adr/0001-shared-ui-ownership.md) for ownership and temporary-gap policy.
Do not add a parallel `components/ui` directory, source aliases to the sibling library,
or local file dependencies.

## Structure and agent guidance

```text
AGENTS.md                       Short repository contract and decision map
src/AGENTS.md                   Dependency and TypeScript rules
src/app/AGENTS.md               Routes, rendering, provider, styles
src/components/AGENTS.md        Application shell and Next.js adapters
src/features/AGENTS.md          Feature ownership
src/features/starter/           Replaceable first capability, with local guidance
src/config/AGENTS.md            Public configuration and locale contracts
src/contents/AGENTS.md          Application translation catalogs
src/lib/AGENTS.md               Shared infrastructure and server boundaries
scripts/AGENTS.md               Generator and architecture checks
docs/adr/AGENTS.md              Decision maintenance
docs/adr/README.md              Indexed decisions with targeted reading paths
```

Read root and applicable ancestor guidance, then only relevant ADRs. Add new scoped
guides when a new layer introduces a distinct contract. The generator ensures new
features inherit guidance; CI checks required guides and static dependency direction.
These checks cannot decide whether a component is reusable or detect every
runtime-computed import.

## Commands

| Command                              | Purpose                                              |
| ------------------------------------ | ---------------------------------------------------- |
| `npm run dev`                        | Development server                                   |
| `npm run generate:feature -- <name>` | Feature and component guidance                       |
| `npm run format`                     | Format source and documentation                      |
| `npm run lint`                       | Type-aware Next.js/React lint                        |
| `npm run check:architecture`         | Guidance, UI dependency, and import boundaries       |
| `npm run typecheck`                  | Route generation and strict TypeScript               |
| `npm test`                           | Native Node tooling regression tests                 |
| `npm run check`                      | Formatting, lint, architecture, types, tooling tests |
| `npm run build`                      | Production compilation and route generation          |
| `npm start`                          | Serve production build                               |

CI runs check and build. Application behavior tests are added alongside real features;
the template does not ship unused Storybook, browser-test, or state-library packages.
Shared component stories/tests belong to the UI library.

## Runtime

Keep pages/layouts server-rendered; isolate interactive adapters with `"use client"`.
Use `server-only` for private data and credentials. Cache Components, partial
prefetching, the Tailwind Turbopack loader, and typed routes are retained from the
baseline; consult the installed Next.js guides before changing their behavior.
System fonts avoid external font downloads.

`NEXT_PUBLIC_` values are public and embedded at build time. Never put secrets in
them. Update `.env.example` and this document as configuration is added.
Run `npm audit` for current dependency findings; review upgrades against the installed
framework documentation and verify them before adoption.
