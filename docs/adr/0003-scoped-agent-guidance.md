# ADR 0003: Scoped agent guidance and durable decisions

- Date: 2026-10-27
- Status: Accepted

## Context

Repeating architecture in prompts wastes context and permits inconsistent decisions.
Guidance needs to survive repository creation and new feature scaffolding.

## Decision

Commit uppercase `AGENTS.md` at root and maintained scaffold boundaries. The root is
a short routing map; descendants contain only local rules and links to relevant ADRs.
Agents read applicable ancestor instructions and only task-relevant references.
ADRs hold rationale, alternatives, and migration impact. Do not require reading the
entire ADR archive for routine edits or copy it into every guide.

The feature generator emits local feature and component guidance, refuses invalid
names and existing targets, and never overwrites business files. CI checks required
guides, per-feature guidance, and dependency direction. New layers get scoped guidance
when they introduce a distinct contract.

## Alternatives

- Prompt-only architecture: rejected because it is lost between sessions.
- One exhaustive root file: rejected because every change loads unrelated context.
- Duplicate every rule everywhere: rejected because guidance diverges.

## Consequences

Documentation is part of architectural maintenance. Scoped loading aims to reduce
repeated context; actual token use depends on the agent client. Template-derived
repositories receive the committed files at creation, not automatic future updates.

## Migration and validation

Keep the Next.js generated root block. Add guides for source, routes, features,
application components, infrastructure, configuration, catalogs, scripts, and ADRs.
Run generator tests and architecture checks. Update guides/ADRs alongside changed contracts.
