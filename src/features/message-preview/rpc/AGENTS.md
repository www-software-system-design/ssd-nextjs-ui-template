# Feature RPC boundary

Follow ADR 0010 and `docs/server-implementation.md`. Keep oRPC procedures and direct
call adapters server-only; keep the HTTP client separate with erased type-only imports.
Use a runtime Standard Schema input backed by the feature's existing validator.
Keep business behavior in services. Compose feature routers in `app/api/rpc/router.ts`;
never import the app router from features or shared infrastructure.

The public preview uses POST and no request identity. For protected procedures,
verify identity for every transport, supply request-scoped context, and authorize
resources in the service. Never put request identity in a shared singleton.
The compatibility adapter returns existing REST/form field errors as data before
the typed direct call; RPC validation failures use oRPC's BAD_REQUEST envelope.
Let unexpected failures propagate. Use direct calls on the server, RPCLink in browser
event handlers, and useActionState for the existing form. No query cache is needed.
