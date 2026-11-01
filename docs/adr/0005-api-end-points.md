# ADR 0005: Route Handlers and Server Actions

- Date: 2026-11-01
- Status: Accepted
- Supersedes: ADR 0004 only for the explicit server implementation sample and runtime baseline

## Context

Adopters need runnable patterns for public HTTP endpoints and application form
submissions without introducing a database, identity provider, or duplicate business
logic. ADR 0002 already assigns business behavior to self-contained features.

## Decision

Use App Router `app/api/**/route.ts` outside locale routing for HTTP contracts.
Use feature-owned `actions/` modules with `"use server"` and async exports for UI
submissions. Both call the same `server-only` feature services directly. Schemas
validate unknown input; model holds serializable result/state contracts. Keep HTTP
and FormData parsing in their entry adapters. Do not expose an action as an API
contract or make server code fetch its own application's endpoints.

Ship one removable, public, stateless message-preview example with both adapters.
It validates and previews user input without pretending to save it. Use library
controls directly and localize application feedback. Return expected validation
failures as data; unexpected failures follow Next.js error handling. Authentication
must be enforced at protected entry points and resource authorization in services
when adopters introduce protected workflows. Proxy is not an authorization layer.

Use native Node tests for server behavior with the `react-server` condition scoped
to the feature-test command. Keep explicit `.ts` imports in directly tested server
modules. Include feature tests in `npm test`, hence `npm run check` and CI.

Align the runtime to Node.js 26.13.0 LTS and its type definitions; retain installed
stable Next.js 16.4.3 and React 19.3.0. The current official docs identify these
framework releases and Node 26 as the newest LTS. No prerelease APIs or dependencies
are required.

## Alternatives

- Duplicate operations in each adapter: rejected because validation and authorization drift.
- Have actions fetch Route Handlers: rejected because an internal HTTP roundtrip adds
  deployment coupling and duplicates security boundaries.
- Introduce a database, fake identity, or in-memory persistence: rejected because
  these would choose product infrastructure or imply durability the template lacks.
- Documentation alone: rejected because users requested runnable samples.

## Consequences

The template gains a removable example capability and two routes. Production
adopters must select authentication, persistence, operational errors, body/rate
limits, CORS, and cache invalidation for real workflows. The example intentionally
does not mutate durable data or invalidate caches. Node 24 users must switch to 26;
Linux images may need libatomic as described in the Node release notes.

## Migration and validation

Run `nvm use` and `npm ci`. `.nvmrc`, package engines, types, and the lockfile change
together; CI already consumes `.nvmrc`. Existing routes and locale redirects remain.
Use `npm run generate:feature` for new capabilities and copy only the applicable
patterns. Remove both sample routes and `features/message-preview` during adoption;
update the feature-test command if no feature tests remain.

Run format, check, and build, then the HTTP/form smoke steps in
[server implementation](../server-implementation.md). Native tests cover service
validation and action state; they do not replace a browser form interaction check.

References: [Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route),
[forms](https://nextjs.org/docs/app/guides/forms),
[Server Actions](https://nextjs.org/docs/app/guides/server-actions),
[data security](https://nextjs.org/docs/app/guides/data-security),
[Next.js support](https://nextjs.org/support-policy),
[React versions](https://react.dev/versions), and
[Node.js 26 LTS](https://nodejs.org/en/blog/release/v26.13.0).
