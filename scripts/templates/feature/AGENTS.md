# {{FEATURE_NAME}} feature

This feature owns the {{FEATURE_NAME}} product capability. Update this sentence with its
domain, entry routes, service contracts, and test command as implementation is added.
Read ADR 0002 in `docs/adr/`. Keep code self-contained; no route or cross-feature
imports. Routes compose features. Add model/services/schemas/hooks only as needed.
Use public shared UI exports; reusable controls belong in the library (ADR 0001).
Mark privileged modules `server-only` and test business behavior in this feature.
For APIs and Server Actions, follow ADR 0005 and `docs/server-implementation.md`.
Keep route/action transport parsing separate from shared validators and server services.
Authenticate protected entry points and authorize resource access in the service.

Server Actions belong in this feature's `actions.ts` with module-level `"use server"`.
Name exported async functions `<verb><Entity>Action` (for example `createInvoiceAction`).
Keep state/types/constants in model and JSX in components; `actions.ts` is not a barrel.
With useActionState accept `(previousState, formData)`; plain forms pass `(formData)`.
Return serializable expected failures, and let unexpected errors reach the boundary.
After writes, invalidate only affected caches and redirect last, outside catch blocks.
Use `--server-actions` when generating a feature to include the action module scaffold.
See ADR 0006; these naming/scaffold rules are repository conventions, not Next.js requirements.
