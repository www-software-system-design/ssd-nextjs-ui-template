# Server services

Import `server-only`. Keep business operations independent of Request, Response,
FormData, and React state. The oRPC procedure calls the service; REST/actions use its direct-call adapter (ADR 0010). Add real integrations
and resource authorization here when adopting; do not simulate persistent storage.
