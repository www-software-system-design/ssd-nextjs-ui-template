# Feature ownership

Read ADR 0002 in `docs/adr/`. Use `npm run generate:feature -- <kebab-case-name>`.
Each feature needs its own `AGENTS.md`; create only layers with actual consumers.
Keep domain types/pure logic in model, integrations in services, validators in schemas,
Server Actions in feature-level `actions.ts`, and business UI in components when needed.
No cross-feature imports or route imports. Routes coordinate capabilities.
Use library UI directly; do not make generic controls feature-private.
Add behavior tests and CI commands with business logic. Mark privileged services
`server-only`; choose caching and authorization explicitly.
For HTTP/Server Action entry points, follow ADR 0005 and `docs/server-implementation.md`.
Keep transport parsing in routes/actions, shared validation in schemas, and business
operations in server-only services. Copy the message-preview feature's boundaries
when needed, rather than importing that example into another feature.
For typed RPC, follow ADR 0010: feature-owned server-only procedures and separate typed
HTTP clients; app routes compose routers. Keep direct server calls off HTTP. RPC is
independent of client state and does not require TanStack Query.
Follow ADR 0006 for action naming/scaffolding: module-level `"use server"`, named
async `<verb><Entity>Action` exports, no JSX or exported state/constants in that module.
`npm run generate:feature -- <name> --server-actions` includes its module scaffold.
Use local React state first; feature-shared client state can use a feature-owned
Zustand factory/provider. Do not add feature data to the application UI store.
Keep action feedback in useActionState and authoritative data on the server.
See ADR 0007 and `docs/state-management.md` for server/client boundaries.
