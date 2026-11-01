# ADR 0006: Server Action naming and scaffolding

- Date: 2026-11-01
- Status: Accepted
- Supersedes: ADR 0005 only for the `actions/` directory convention

## Context

The Server Action example's technology-named page made the UI route look like the
action implementation. Action modules also need a consistent name and an opt-in
scaffold so adopters can follow the Next.js guide without creating unused layers.

## Decision

Use one feature-level `src/features/<name>/actions.ts` with module-level
`"use server"`. Export only named async action functions, using
`<verb><Entity>Action` (for example `previewMessageAction`). Keep serializable state,
types, initial state, and constants in model; JSX belongs in components. Action
modules define entry functions directly rather than re-exporting a mixed barrel.
Keep the shared server-only service independent of React/FormData/HTTP.

Next.js uses `actions.ts` in its documentation, but does not require that filename
or an `Action` function suffix. The compiler boundary is the directive and async
function exports. These naming choices are repository conventions that fit the
existing feature ownership rules; they do not move business behavior into app routes.

`page.tsx` remains a Server Component rendering the form that invokes the action.
Name the sample page route `/[locale]/examples/message-preview` after its workflow,
with `MessagePreviewPage` as its default component. It is not an HTTP action endpoint.
Next.js manages action references and POST dispatch against the invoking page.

Extend `generate:feature` with optional `--server-actions`. The default remains
minimal. The option emits `actions.ts` with the directive and implementation guidance,
without an exported fake operation. Add real domain functions and model contracts
when implementing the feature. Both modes include action naming/boundary guidance,
refuse invalid arguments/traversal, and never overwrite existing features.

## Alternatives

- Keep operation files under `actions/`: valid Next.js, but unnecessary indirection
  for this template's small feature-owned action modules.
- Put all actions in a global `app/actions.ts`: rejected because ownership would
  move outside features and unrelated capabilities would share an entry module.
- Put `"use server"` on a page module: rejected because its exports render a page
  rather than defining callable action entry points.
- Scaffold an exported no-op or throwing placeholder: rejected because it would
  introduce a callable endpoint before a real workflow exists.

## Consequences

Names distinguish action entry functions, pure services, and UI components.
The scaffold provides boundaries without choosing a domain, database, or identity
provider. Authentication, validation, serializable results, and post-write cache
updates remain governed by ADR 0005 and the implementation guide.

## Migration and validation

Move `message-preview/actions/preview-message.ts` to `message-preview/actions.ts`;
rename `previewMessage` to `previewMessageAction` and update imports/tests. Move the
demo from `/examples/server-actions` to `/examples/message-preview`; update links
and typed PageProps. The sample had no published compatibility contract. Its JSON
endpoint and service behavior stay the same.

Test default and opted-in generation, rejected options before writes, and overwrite
protection. Run format, check, and build. See the
[implementation guide](../server-implementation.md) for the form and endpoint smoke checks.

Reference: [Next.js Server Actions and Mutations](https://nextjs.org/docs/app/guides/server-actions).
