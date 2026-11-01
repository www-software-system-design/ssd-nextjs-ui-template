# Repository tooling

Use TypeScript executed by Node 26 LTS. Keep scaffolds portable and deterministic.
Reject invalid/path-traversal names and existing feature targets; never overwrite files.
Feature generation must include scoped guidance (ADR 0003).
Run `npm test` after generator or architecture-check changes. Keep architecture
enforcement in `npm run check`; describe its static-analysis limits honestly.
Keep default scaffolds minimal. `--server-actions` opts into a feature-level
`actions.ts` template; it must not invent an exported operation or overwrite files.
See ADR 0006 for naming, action boundaries, and the generated guidance contract.
