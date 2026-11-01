# HTTP endpoints

Use App Router `route.ts` with named HTTP method exports and Web Request/Response.
Keep endpoints outside locale routes; the locale proxy excludes `/api`.
Translate content type, parsing, validation, and domain outcomes to HTTP responses;
put business operations in feature server-only services. Do not call Server Actions
from Route Handlers or fetch this app's endpoints from Server Components.
Authenticate protected requests and authorize resources before performing operations.
Choose caching, request-size/rate limits, and cross-origin policy for the deployment.
See `docs/server-implementation.md`, ADR 0005, and ADR 0010 before adding endpoints.
Message preview routes existing REST calls through its feature-owned oRPC adapter.
`rpc/router.ts` composes feature procedures; the catch-all mounts the Fetch RPCHandler.
Keep typed client imports separate from server-only routers and services.
