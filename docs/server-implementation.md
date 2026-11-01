# API endpoints and Server Actions

Use a Route Handler when another HTTP client needs a stable URL and HTTP contract:
mobile clients, integrations, webhooks, or browser fetch calls. Use a Server Action
for a form or mutation owned by this Next.js UI. Actions use Next.js's POST protocol
and are not a public REST API. For reads in Server Components, call the service
or procedure directly instead of using an action or fetching the app's own endpoint.

These examples follow the installed Next.js 16.4.3 guides and the official
[Route Handler](https://nextjs.org/docs/app/api-reference/file-conventions/route),
[forms](https://nextjs.org/docs/app/guides/forms),
[Server Actions](https://nextjs.org/docs/app/guides/server-actions), and
[data security](https://nextjs.org/docs/app/guides/data-security) documentation.

## Layout

```text
src/app/api/message-preview/route.ts                Compatibility JSON → HTTP response
src/app/api/rpc/router.ts                           Feature router composition
src/app/api/rpc/[[...rest]]/route.ts                 oRPC Fetch adapter
src/app/[locale]/examples/message-preview/page.tsx  Thin localized UI page
src/features/message-preview/
  actions/message-preview.action.ts                previewMessageAction: FormData → state
  components/message-preview-form.tsx              useActionState + shared UI
  model/preview.ts                                 Serializable contracts and limits
  schemas/message.ts                               Unknown input → validated text
  rpc/router.ts                                    Validated procedure
  rpc/preview-message.ts                           Direct call + REST/form field errors
  rpc/client.ts                                    Typed HTTP client
  services/create-message-preview.ts               Server-only operation
  preview.test.ts                                  Service and action behavior
  rpc.test.ts                                      Client/handler and direct-call behavior
```

Both existing entry points call `previewMessage`, which returns expected field errors
as data and invokes the oRPC procedure directly for valid input. The procedure and
service share the existing validator; RPC also validates independently at its boundary.
This public sample trims a message and returns its Unicode code-point count. It saves nothing, logs
no user text, and has no credentials or mock storage. The 500-unit input limit uses
JavaScript string length (UTF-16 units), matching HTML `maxLength`; the resulting
count uses code points, not grapheme clusters.

## HTTP endpoint sample

Run `npm run dev`, then:

```sh
curl -i http://localhost:3000/api/message-preview \
  -H 'Content-Type: application/json' \
  --data '{"message":"  Hello from the API  "}'
```

Expected status `200` and body:

```json
{
  "status": "success",
  "data": { "message": "Hello from the API", "characters": 18 }
}
```

| Request                                          | Status | Response contract                          |
| ------------------------------------------------ | ------ | ------------------------------------------ |
| Valid JSON and message                           | 200    | `status: "success"`, normalized `data`     |
| Malformed JSON                                   | 400    | `error.code: "INVALID_JSON"`               |
| GET, PUT, or DELETE                              | 405    | Next.js handles unsupported methods        |
| Missing/non-JSON Content-Type                    | 415    | `error.code: "UNSUPPORTED_MEDIA_TYPE"`     |
| Missing, non-string, blank, or oversized message | 422    | `status: "invalid"`, `fieldErrors.message` |

Field errors are stable codes (`required`, `tooLong`), translated by UI consumers.
Unknown object properties are ignored; only explicit fields reach the operation.
POST responses include `Cache-Control: no-store`. The API is outside locale
segments and the existing proxy excludes `/api`, so it receives no locale redirect.
The handler uses Web `Request` and `Response.json`; use `NextRequest` or
`NextResponse` only when their additional helpers are needed.

Smoke-check failure paths:

```sh
curl -i http://localhost:3000/api/message-preview \
  -H 'Content-Type: application/json' --data '{'
curl -i http://localhost:3000/api/message-preview \
  -H 'Content-Type: application/json' --data '{"message":" "}'
curl -i http://localhost:3000/api/message-preview \
  -H 'Content-Type: text/plain' --data 'hello'
curl -i http://localhost:3000/api/message-preview
```

## Typed RPC calls

The integration follows [oRPC v1's Next.js adapter](https://v1.orpc.dev/docs/adapters/next)
and [direct server calls](https://v1.orpc.dev/docs/client/server-side), pinned to stable
1.16.1. See [ADR 0010](adr/0010-orpc-server-boundary.md) for compatibility and boundaries.

Use the typed HTTP client from a browser event handler when a workflow needs RPC:

```ts
import { createMessagePreviewClient } from "@/features/message-preview/rpc/client";

// Inside a browser event handler, after window is available:
const client = createMessagePreviewClient(window.location.origin);
const result = await client.create({ message: "Hello from RPC" });
// result is inferred as PreviewResult; handle success/invalid states as appropriate.
```

Routes may compose feature clients; unrelated features must not import this example.
The client imports router types only, so server services do not enter browser bundles.
Its explicit origin avoids reading browser globals during server rendering. It needs
no provider or TanStack Query. Add a query cache only for a real client caching need.

The client sends POST `/api/rpc/messagePreview/create` using oRPC's protocol. This is
separate from the stable REST JSON format at `/api/message-preview`. For a raw smoke
check (application callers should use the typed client):

```sh
curl -i http://localhost:3000/api/rpc/messagePreview/create \
  -H 'Content-Type: application/json' \
  --data '{"json":{"message":"Hello from RPC"}}'
```

Expect 200 with `json.status: "success"` and normalized `json.data`. Invalid input
produces oRPC's 400 `BAD_REQUEST` envelope with field issues; unknown procedures
return 404. Only POST is exposed, and responses use `Cache-Control: no-store`.
No locale prefix, CORS override, authentication, or storage is added to this public sample.

Server code uses the direct adapter instead of an HTTP round trip:

```ts
import { previewMessage } from "@/features/message-preview/rpc/preview-message";

const result = await previewMessage({ message: "Hello from the server" });
```

This adapter accepts unknown transport input, returns the existing `required` or
`tooLong` field-error data, and calls `messagePreviewRouter.create` with oRPC's `call`
for valid input. The typed procedure uses a Standard Schema adapter backed by
`validateMessage`; rules remain in one place. Services retain their domain validation.
Unexpected errors propagate. The existing Server Action form continues to use
`useActionState`, pending feedback, and Next.js's native action protocol.

For another feature, create its own server-only `rpc/router.ts`, schema, service,
and separate typed client only if consumed. Register that router in
`src/app/api/rpc/router.ts`; do not import the application router into a feature or
shared infrastructure. For protected procedures, verify identity in each transport,
pass request-scoped context to direct and HTTP callers, and authorize resources in
the service. Never share a session or request context across users in module state.

## Server Action sample

Visit `/en/examples/message-preview` or `/hi/examples/message-preview`. Enter text and
submit to see the normalized preview and count. Whitespace-only text exercises
server-side validation even when HTML `required` passes. Verify localized error
feedback, pending feedback, and a successful retry. Browser submission disables
the button while pending; unexpected exceptions use the existing locale error boundary.

[`src/features/message-preview/actions/message-preview.action.ts`](../src/features/message-preview/actions/message-preview.action.ts)
has module-level `"use server"` and exports only an
async function. Model types/constants live outside that module. With `useActionState`,
the signature is `(previousState, formData)`, and `<form action={formAction}>`
dispatches the action. The action extracts explicit fields, calls the direct oRPC adapter, and
returns serializable state. It ignores previous state when validating the operation;
clients can tamper with it. The client imports the action reference, never its service.

### Why there is a page

The page is the UI host for the example. Its job is to resolve the locale, render
headings, and mount `MessagePreviewForm`. The form imports `previewMessageAction`
from the feature's `actions/message-preview.action.ts` and passes it to `useActionState`; the returned
`formAction` is passed to `<form action={formAction}>`. Next.js sends the submission
back to the server using the action reference. `page.tsx` contains no action logic
and needs no `"use server"` directive: it is already a Server Component by default.

A Server Component renders UI on the server. A Server Action is an async Server
Function invoked through React's action mechanisms. An async page component alone
does not make it a Server Action, and an action does not need its own `page.tsx`
or `route.ts`. Existing pages/components can invoke the same feature action.

### Naming and scaffolding contract

The Next.js guide shows `actions.ts` modules and named async functions. It does
not reserve that filename or require a particular directory or function suffix.
This repository chooses the following conventions (see [ADR 0006](adr/0006-server-action-conventions.md)):

| Concern         | Convention                                                                         | Example                                                      |
| --------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Action module   | Feature-owned `actions.ts`; module-level `"use server"`; only async action exports | `features/message-preview/actions/message-preview.action.ts` |
| Action function | camelCase `<verb><Entity>Action`                                                   | `previewMessageAction`                                       |
| Form component  | kebab-case file; PascalCase component; `"use client"` when using `useActionState`  | `message-preview-form.tsx`, `MessagePreviewForm`             |
| UI page         | Next.js `page.tsx` in a workflow-named route; default page component               | `examples/message-preview/page.tsx`, `MessagePreviewPage`    |
| Action state    | Feature-specific serializable type in model, outside the action module             | `MessagePreviewActionState`                                  |
| Server service  | kebab-case file; camelCase domain operation; `server-only` marker                  | `create-message-preview.ts`, `createMessagePreview`          |

For a form using `useActionState`, export an async function accepting
`(previousState, formData)`. A plain form action without `useActionState` accepts
`(formData)`. Use the same action reference from event handlers only within the
appropriate React action/transition context. Do not invoke it during render or use
it as a general data-fetching API. Parallelize necessary work inside the server
operation; client Server Actions are dispatched sequentially.

Scaffold a capability that will have Server Actions:

```sh
npm run generate:feature -- invoices --server-actions
```

This adds feature/component guidance plus `src/features/invoices/actions.ts` with
`"use server"` and comments describing the contract. It intentionally exports no
callable function until you implement an actual operation. Add model contracts,
validation, and the server service for that operation, then export a named async
function from `actions.ts`. The default command without the option creates only
the existing guidance scaffold; existing features are never overwritten. For an
existing feature, add `actions.ts` following these rules without regenerating it.

The generator currently emits a feature-root `actions.ts` as recorded in ADR 0006.
The current message-preview sample groups its module under `actions/message-preview.action.ts`;
its form and tests import that nested path. Both locations use the same directive,
async export, and state contracts. The scaffold command does not move an existing
module or create an HTTP route for an action.

The feature uses the published `TextArea` and `Button`. Inputs have labels and HTML
constraints; server validation remains authoritative. Inline errors use
`aria-describedby`/`aria-invalid` and a polite live region. Returned input values
survive form resets, bounded to the field limit. The small Client Component owns
pending/action state; the page and application shell remain Server Components.

## Add a real workflow

1. Run `npm run generate:feature -- <name> --server-actions` for form workflows;
   omit the option for features that do not need actions. Add schemas, model, and services
   only when consumed, with scoped guidance for their contracts. Use this sample as
   a reference; features must not import it or other unrelated features.
2. Put credentials, database access, integrations, and privileged logic in modules
   importing `server-only`. Validate unknown input at the service boundary. Keep
   transport-specific parsing in the Route Handler or action. Add behavior tests
   beside the feature and include their command in check/CI.
3. For protected operations, verify the real session/token in **each** entry point,
   then authorize the requested resource in the service using the verified identity.
   Never accept identity/roles from hidden fields, bound arguments, or prior state.
   Return 401/403 as appropriate for the API; define equivalent safe action results.
   Next.js's action origin checks and obscured action IDs do not replace authorization.
4. Perform durable writes through the selected database/service. Handle expected
   domain failures as typed results and appropriate HTTP statuses. Unexpected
   failures should use server observability and safe error handling; never return
   raw exceptions, tokens, or database records with private fields. Keep `redirect`
   outside catch blocks because it throws a framework control-flow exception.
5. Invalidate only the affected caches **after a successful write**. Use
   `revalidatePath` for a path; `updateTag` for immediate read-your-own-writes in
   Server Actions; or `revalidateTag(tag, "max")` for stale-while-revalidate from
   actions or Route Handlers. Do not use deprecated one-argument `revalidateTag`.
   This stateless sample has no stale data to invalidate.
6. Configure request-size/rate limits, timeouts, and cross-origin policy at the
   deployment boundary for your actual workload. The field limit here is validation
   after JSON parsing, not a limit on incoming HTTP body bytes. Server Actions have
   Next.js's default 1 MB body limit. Do not enable permissive CORS or increase body
   limits without a requirement. Cookie-authenticated custom mutation endpoints also
   need appropriate CSRF protection; action origin checking does not cover them.

Cache Components is enabled in this repository. Do not copy `dynamic = "force-*"`
or other incompatible legacy route configuration. POST is uncached; future GET
handlers must choose public caching versus request-time data deliberately. Keep
`"use cache"` helpers separate from the Route Handler body and do not cache private
session-dependent data in shared public caches.

## Validation and adoption

Use Node.js 26.13.0 LTS via `nvm use`, then `npm ci`. Next.js 16.4.3 and React 19.3.0
are retained stable releases. See [ADR 0005](adr/0005-api-end-points.md) for the
runtime migration and upstream support references.

`npm run test:features` uses native Node tests with `--conditions=react-server` so
the server-only marker resolves as it would on the server. This condition is scoped
to that command; do not set it globally for browser/build commands. Explicit `.ts`
imports in the tested server modules work with the existing TypeScript configuration.
`npm test` runs tooling and feature tests, and `npm run check` includes both.
The feature tests exercise invalid types (including files), bounds, whitespace,
Unicode counting, FormData mapping, and serializable action state. RPC tests also
exercise typed client/handler round trips, invalid untyped inputs, and unknown paths.

Run `npm run format`, `npm run check`, and `npm run build`, then the HTTP and form
smoke checks above against the running app. Native action tests do not exercise the
browser's Next.js action protocol or pending/accessibility behavior.

For adoption, delete the example feature and its API/page routes, remove its
registration from `app/api/rpc/router.ts`, and remove its
catalog entries and README links. If no feature tests remain, remove or adjust
`test:features` and its `npm test` invocation. Keep the architecture and generated
feature guidance so future capabilities follow the same contracts.
