<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repository conventions

This is an MFE application template. Generic UI belongs in `@software-system.design/ui`;
business behavior and Next.js adapters belong here. Do not recreate `components/ui`.

- Read applicable descendant `AGENTS.md` files before editing. Load only relevant
  references from [architecture](docs/architecture.md) and the [ADR index](docs/adr/README.md).
- UI/dependencies: ADR 0001. Routes/features/server boundaries: ADR 0002.
  Scaffolding/guidance: ADR 0003. Baseline/tooling: ADR 0004.
- Guidance lives in `src/`, its scaffolded layers, `scripts/`, and `docs/adr/`.
  Use `npm run generate:feature -- <name>` so new features inherit local guidance.
- Preserve unrelated changes. Use strict TypeScript; keep routes thin and features
  self-contained. Generic reusable components are consumed through public library exports.
- For every new feature, verify current releases and support status in official
  documentation for Next.js and the associated tools, frameworks, and packages.
  Use current stable APIs and features; avoid deprecated APIs and experimental features.
  Prefer the latest supported LTS release where an LTS channel exists; otherwise use
  the latest stable release. Do not adopt alpha, beta, RC, canary, or other prereleases.
  Check compatibility with the repository's runtime and dependency versions before
  upgrading. Read the installed Next.js guides and relevant official migration guides;
  update affected version constraints and the lockfile together, then run check and build.
  Report compatibility blockers instead of silently using outdated or prerelease APIs.
- Commit subjects must use `<feat/fix>(SSD-000): <add/update/resolve/remove/cleanup> message`.
  Choose `feat` or `fix`, a three-digit SSD ticket, one listed action, and a description.
  Example: `feat(SSD-000): add template tooling`. Husky validates every local commit;
  keep its `commit-msg` hook enabled and do not bypass it.
- Follow [CONTRIBUTING.md](CONTRIBUTING.md). Run `npm run check` and `npm run build`
  for code/configuration changes; report actual results and remaining limitations.
- Material architectural changes need an ADR and updated scoped guidance in the same change.
