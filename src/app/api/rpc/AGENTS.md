# RPC HTTP adapter

Compose feature routers in `router.ts`; the catch-all Route Handler only dispatches
through oRPC's Fetch RPCHandler with the `/api/rpc` prefix. Keep RPC outside locales.
Only POST is exposed for the current mutation. Unknown paths return 404; responses
are no-store. Browser clients use RPCLink, not the compatibility REST JSON format.
Add request-specific verified context here for protected operations, with equivalent
verification in direct server callers. See ADR 0010 before extending the transport.
