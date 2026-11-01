# Architecture decision records

Read only decisions relevant to the change. All decisions below are accepted.

| ADR                                       | Decision                                       | Read when                                               |
| ----------------------------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| [0001](0001-shared-ui-ownership.md)       | Shared UI package and MFE ownership            | Adding UI or dependencies                               |
| [0002](0002-feature-boundaries.md)        | Feature structure and rendering boundaries     | Adding routes, features, services, state                |
| [0003](0003-scoped-agent-guidance.md)     | Scoped agent guidance and durable decisions    | Scaffolding or changing architecture                    |
| [0004](0004-minimal-template.md)          | Minimal inheritable baseline                   | Adopting the template or selecting tooling              |
| [0005](0005-api-end-points.md)            | HTTP endpoints and Server Actions; Node 26 LTS | Adding server workflows or adopting samples             |
| [0006](0006-server-action-conventions.md) | Server Action naming and opt-in scaffolding    | Naming actions, scaffolding forms, locating the example |

Copy [template.md](template.md) for the next sequential decision. Record context,
alternatives, consequences, and migration impact. Supersede accepted decisions with a
new record and update this index; do not silently change their meaning.
