# App Router

Read ADR 0002 in `docs/adr/` and the installed Next.js guides for the API being changed.
Pages/layouts compose features and remain Server Components. Await route params.
Business rules, mutations, and service implementations belong in features.
Mount the shared UI provider in the locale layout; import library CSS once via globals.
Pass matching locale/direction and translated messages. Client callbacks belong inside
client adapters. Every page, including feedback, supplies one `main#main-content`.
Do not disable typed routes or move secrets into client imports.
