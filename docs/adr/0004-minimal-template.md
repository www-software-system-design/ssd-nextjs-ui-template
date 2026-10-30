# ADR 0004: Minimal inheritable baseline

- Date: 2026-10-27
- Status: Accepted

## Context

Demonstration workflows and unused tooling become accidental product requirements
when a repository is created from a template.

## Decision

Ship one localized starter with shared UI, route feedback, strict TypeScript,
format/lint/type/architecture checks, generator tests, and a production build in CI.
Keep the existing App Router, cache components, partial prefetching, Tailwind
Turbopack integration, and typed routes. Keep English/Hindi localization as an
explicit replaceable baseline. Do not ship demo credentials, users, notices, carts,
counter tutorials, unused framework assets, or unconfigured test/Storybook packages.

## Alternatives

- Full demo application: rejected because business assumptions leak into every MFE.
- Empty skeleton: rejected because it fails to demonstrate actual library integration.
- Preselect all state/testing/auth tools: rejected until a concrete feature needs them.

## Consequences

Adopters choose authentication, persistence, federation/host integration, and feature
test runners based on actual requirements. Shared controls are documented/tested in
the library. MFEs add tests for their own business behavior and integrations.

## Migration and validation

Replace sample routes with one starter; remove unused dependencies and assets.
Update adoption/contribution instructions and the lockfile. Run check, production
build, and a runtime smoke check for locales, redirection, and shared UI rendering.
