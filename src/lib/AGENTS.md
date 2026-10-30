# Shared infrastructure

Only cross-feature infrastructure with actual consumers belongs here.
Never import routes or features, or hide business workflows in a generic helper.
Use `server-only` for credentials/private data; keep browser-safe modules separate.
Validate external input at runtime when introduced. Do not build a universal fetch
wrapper. Read installed Next.js caching guidance when adding IO. See ADR 0002.
