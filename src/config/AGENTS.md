# Public configuration

Keep configuration typed and safe for the browser; no credentials or private data.
Update locale names/directions, catalogs, and provider messages together.
Do not import features, routes, or server-only services. Document environment additions
in `.env.example`; validate server environment separately when introduced.
`theme.ts` defines the public theme enum, validation, storage key, and static
bootstrap strings (ADR 0008). Never interpolate request/user text into scripts.
