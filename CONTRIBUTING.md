# Contributing

1. Use Node.js 24 and `npm ci`.
2. Read root and applicable scoped `AGENTS.md` files; consult only relevant
   [ADRs](docs/adr/README.md) and [architecture](docs/architecture.md).
3. Check shared library exports before adding UI. Generic reusable components belong
   in `@software-system.design/ui`; feature business components belong in the MFE.
4. Scaffold with `npm run generate:feature -- <name>`. Update its local guide as
   contracts and tests are introduced. Keep routes thin and server/client boundaries explicit.
5. Add tests for business logic and critical interactions, with their command in CI.
   Run `npm test` for generator/architecture changes.
6. Run `npm run format`, `npm run check`, and `npm run build` for code/config changes.
   Documentation-only changes need formatting and architecture guidance checks.
7. Material architectural changes need a new ADR, migration impact, and updated guides.
   Describe the concrete problem, resulting behavior, verification, and limitations in the PR.

Keep application and tooling source in TypeScript. Do not disable lint/type checks to
hide failures. Document narrow exceptions. Keep secrets out of source control; update
`.env.example` with configuration changes. Pin the shared UI release, commit lockfile
updates, and review dependency findings. No local sibling-library paths in published
template configuration. No package publishing or deployment is part of ordinary changes.

## Commit messages

Use `<feat/fix>(SSD-000): <add/update/resolve/remove/cleanup> message` for every
commit subject. Choose `feat` or `fix`, replace `000` with the three-digit SSD ticket,
and choose one of `add`, `update`, `resolve`, `remove`, or `cleanup` before a nonempty
description. For example: `feat(SSD-000): add template tooling`. An optional body
may follow a blank line. Merge and fixup subjects must also follow this format.

`npm ci` installs Husky through the `prepare` script. Its `commit-msg` hook rejects
subjects that do not match. Keep hooks enabled; Git hooks are local and can be
bypassed, so they do not replace remote branch protection. To check a message file
manually, run `npm run check:commit -- <commit-message-file>`.
