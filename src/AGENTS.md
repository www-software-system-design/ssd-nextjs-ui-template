# Application source

Read [ADR 0001](../docs/adr/0001-shared-ui-ownership.md) for UI ownership and
[ADR 0002](../docs/adr/0002-feature-boundaries.md) for dependencies.
Use strict TypeScript, kebab-case files, named exports, and explicit imports.
Routes compose features; features consume shared layers. Shared layers cannot import
features/routes. Features cannot import each other. Add directories only for real use.
Keep server/client graphs separate; no mixed barrels. Read the relevant child guide.
