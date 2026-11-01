# Message preview example

Replaceable, public, stateless sample for both entry points in ADR 0005.
`POST /api/message-preview` and `/{locale}/examples/message-preview`
call the same server-only service. Preview input without storing or logging it.
Keep normalization/validation shared; neither adapter calls the other over HTTP.
Model types and limits may enter client bundles; services must not.
Use explicit `.ts` imports in server modules so native Node tests can load them.
Run `npm run test:features`; runtime endpoint checks are in `docs/server-implementation.md`.

Define the `previewMessageAction` async function in this feature's `actions/message-preview.action.ts`
with module-level `"use server"` (ADR 0006). Export only async action functions;
keep state/types/constants in model and JSX in components. Treat every argument,
including previous state and bound/hidden values, as untrusted. Return expected
validation failures as serializable data; let unexpected failures reach the route
error boundary. Protected operations must authenticate in the action and authorize
resources in the service. Invalidate affected caches only after successful writes;
redirect last, outside catch blocks. This stateless example needs neither operation.
