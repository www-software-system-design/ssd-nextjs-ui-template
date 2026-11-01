# App Router

Read ADR 0002 in `docs/adr/` and the installed Next.js guides for the API being changed.
Pages/layouts compose features and remain Server Components. Await route params.
Business rules, mutations, and service implementations belong in features.
Mount the shared UI provider in the locale layout; import library CSS once via globals.
Pass matching locale/direction and translated messages. Client callbacks belong inside
client adapters. Every page, including feedback, supplies one `main#main-content`.
Keep app-wide metadata such as `manifest.ts` at the app root, outside locale routes.
Maintain its install icons in `public/`; add service workers or offline behavior only
for an explicit product requirement.
Do not disable typed routes or move secrets into client imports.
For HTTP endpoints read `api/AGENTS.md`; for Server Actions read ADR 0005 and
`docs/server-implementation.md`. Keep both adapters thin and call feature services directly.
Pages render the UI that invokes Server Actions; `page.tsx` is not an action module.
Keep reusable feature actions in `features/<name>/actions.ts` per ADR 0006.
