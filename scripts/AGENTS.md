# Repository tooling

Use TypeScript executed by Node 24. Keep scaffolds portable and deterministic.
Reject invalid/path-traversal names and existing feature targets; never overwrite files.
Feature generation must include scoped guidance (ADR 0003).
Run `npm test` after generator or architecture-check changes. Keep architecture
enforcement in `npm run check`; describe its static-analysis limits honestly.
