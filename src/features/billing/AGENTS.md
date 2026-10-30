# billing feature

This feature owns the billing product capability. Update this sentence with its
domain, entry routes, service contracts, and test command as implementation is added.
Read ADR 0002 in `docs/adr/`. Keep code self-contained; no route or cross-feature
imports. Routes compose features. Add model/services/schemas/actions/hooks only as needed.
Use public shared UI exports; reusable controls belong in the library (ADR 0001).
Mark privileged modules `server-only` and test business behavior in this feature.
