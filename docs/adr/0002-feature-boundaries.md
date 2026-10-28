# ADR 0002: Feature structure and rendering boundaries

- Date: 2026-10-27
- Status: Accepted

## Context

Inheriting MFEs need predictable ownership without imposing unnecessary abstractions.

## Decision

Routes compose self-contained `features/<kebab-case-name>`. Features may use shared
application adapters, configuration, infrastructure, and the UI library; unrelated
features cannot import one another. Shared layers cannot import routes or features.
Create feature layers only when needed. Keep routes thin and server-rendered; interactive
adapters define client boundaries. Mark privileged modules `server-only`. State,
fetching/caching, runtime validation, and authorization belong to the consuming MFE.
No global store, identity provider, or federation runtime is selected by default.

## Alternatives

- Technical layers spanning every feature: rejected because feature changes scatter.
- Import arbitrary features: rejected because cycles and hidden ownership result.
- Make the whole app a Client Component: rejected because server boundaries disappear.

## Consequences

Some integration code belongs locally despite consuming shared controls. Routes
coordinate features or use an explicitly shared contract. TypeScript and architectural
checks provide enforcement, but reviewers still judge business ownership.

## Migration and validation

Move future business capabilities into generated features. Remove demo authentication
and cart state from the baseline. Architecture checks cover static imports, exports,
and literal dynamic imports through aliases and relative paths; runtime-computed imports
and semantic reuse decisions require review. Run check and build.
