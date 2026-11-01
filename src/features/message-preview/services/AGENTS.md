# Server services

Import `server-only`. Keep business operations independent of Request, Response,
FormData, and React state. Both adapters call services directly. Add real integrations
and resource authorization here when adopting; do not simulate persistent storage.
