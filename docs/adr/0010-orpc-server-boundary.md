# ADR 0010: Typed oRPC procedures behind HTTP and Server Actions

- Date: 2026-11-01
- Status: Accepted
- Supersedes: ADR 0005's direct adapter-to-service calls for message preview only

## Context

Message preview already supports a public REST endpoint and a Next.js Server Action.
Typed browser callers need a runtime-validated RPC contract while existing HTTP and
form consumers need their current statuses, field errors, and pending behavior.
The application has no client server-data caching requirement.

## Decision

Use stable `@orpc/server` and `@orpc/client` 1.16.1 with Standard Schema 1.1.0.
The [Standard Schema 1.1 release](https://github.com/standard-schema/standard-schema/releases/tag/v1.1.0)
adds JSON Schema types and retains the StandardSchemaV1 validation interface.
The installed Next.js 16.4.3, React 19.3.0, and Node 26 LTS remain unchanged.
oRPC's default documentation currently targets the 2.0 beta; use the
[v1 Next.js adapter](https://v1.orpc.dev/docs/adapters/next) and
[v1 server clients](https://v1.orpc.dev/docs/client/server-side) documentation.
The [1.16.1 release](https://github.com/middleapi/orpc/releases/tag/v1.16.1)
is the stable release verified for this integration. Do not adopt prerelease APIs.

Feature-owned `rpc/router.ts` defines procedures with a runtime Standard Schema
input backed by the existing validator. Server-only services retain business behavior
and resource authorization. Thin app composition mounts feature routers in
`app/api/rpc/router.ts`; the Fetch RPCHandler exposes POST `/api/rpc/**` outside locales.
Keep responses uncached and return 404 for unmatched paths. Add HTTP methods only
when procedures need them.

Existing REST and Server Action adapters call a feature-owned server adapter, which
converts unknown inputs into the established field-error results and uses oRPC's
direct `call` for valid input. The procedure validates HTTP RPC calls independently.
The service retains its own validation for direct domain callers. All checks share
one validator; rules are not copied. Unexpected failures propagate.

Browser consumers use a feature-owned typed RPCLink client; router imports there
are type-only and erased. Server callers call procedures directly, without fetching
their own application. No global request identity or universal server/client singleton
is introduced. Protected workflows must authenticate every entry point, pass verified
request-scoped context, and authorize resources in services.

Keep the existing form on `useActionState` and Next.js's action protocol. Retain
Zustand for client preferences. Do not add TanStack Query until a concrete workflow
requires client caching, refetching, or optimistic server-data updates.

## Alternatives

- Native Route Handlers and Server Actions alone remain valid for simple workflows,
  but do not provide the requested inferred HTTP client contract.
- Replacing the REST endpoint with RPC would break existing JSON/status consumers.
- OpenAPI generation is deferred until external contract tooling is required.
- Converting the existing form to browser RPC would discard its useful Next.js form
  integration without adding needed behavior.

## Consequences

REST, Server Actions, and RPC share one operation. The dependency and validation
adapter add some cost; server adapters intentionally validate before the typed call
so expected form/REST failures stay data. RPC uses its own protocol envelope and
400 validation errors, whereas the compatibility REST endpoint retains 422.
No authentication, persistence, retry policy, or client query cache is simulated.

## Migration and validation

Existing URLs, form state, translations, and REST responses remain compatible.
New typed consumers call `createMessagePreviewClient(origin).create({ message })`.
Follow `docs/server-implementation.md` for ownership and adoption. Remove the example
router registration, feature, and API/page routes together during adoption.

Native feature tests cover typed client/handler round trips, untyped invalid HTTP
input, bounds, unknown routes, direct-call compatibility, and existing action state.
Run format, check, build, and runtime REST/RPC/form smoke checks. Installed Next.js
Route Handler and Server Action guides were read before implementation.
