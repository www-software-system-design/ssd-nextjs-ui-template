# Application adapters

Read ADR 0001 in `docs/adr/` before adding UI. This directory holds application shell
composition and framework integrations such as locale navigation and route feedback.
Import generic controls from public `@software-system.design/ui/<control>` subpaths.
No local UI kit, copies, identity wrappers, or library re-export barrels.
Business-specific UI lives inside its feature; shared adapters cannot import features
or routes. Document the concrete application behavior that justifies a local adapter.
