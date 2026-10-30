# ADR 0001: Shared UI package and MFE ownership

- Date: 2026-10-27
- Status: Accepted

## Context

Copying generic components into every MFE creates incompatible APIs, accessibility,
and themes. The shared React package already defines a public consumer contract.

## Decision

Install published `@software-system.design/ui` by default, pinned with a lockfile.
Import controls from public subpaths, load its CSS once, and mount its scoped provider
with the application's locale/direction. MFEs own domain logic, data, authorization,
routing, state, and framework adapters. Reusable visual components belong in the
library; MFE-specific composition lives in the feature. Do not maintain `components/ui`,
private-source imports, sibling-repository links, or identity wrappers.
Check reuse potential before adding local UI. A temporary library gap needs an ADR
with an owner and extraction plan; a missing release is not a reason to copy controls.

## Alternatives

- Per-MFE UI kits: rejected because fixes and contracts diverge.
- Source aliases or local file dependencies: rejected because new repositories cannot install independently.
- Put business components in shared UI: rejected because domain coupling prevents reuse.

## Consequences

Library changes require a separate tested release before adoption. SSR and callback
boundaries remain explicit. Semantic HTML and application layout remain local.

## Migration and validation

Remove the duplicated Button and its library-owned stories/tests. Consume version
0.3.0 from npm and validate direct imports, CSS, provider, and production compilation.
The library repository is unchanged. Future upgrades update package and lock together.
