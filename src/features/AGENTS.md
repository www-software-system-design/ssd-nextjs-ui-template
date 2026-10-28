# Feature ownership

Read ADR 0002 in `docs/adr/`. Use `npm run generate:feature -- <kebab-case-name>`.
Each feature needs its own `AGENTS.md`; create only layers with actual consumers.
Keep domain types/pure logic in model, integrations in services, validators in schemas,
mutations in actions, and business UI in components when needed.
No cross-feature imports or route imports. Routes coordinate capabilities.
Use library UI directly; do not make generic controls feature-private.
Add behavior tests and CI commands with business logic. Mark privileged services
`server-only`; choose caching and authorization explicitly.
