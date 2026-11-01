# Application state factories

Keep app-wide public client preferences here; feature/domain state belongs in its
feature. Export typed `zustand/vanilla` factories, never module-level store instances.
Instantiate only inside a mounted Client Component provider. Server Components,
Route Handlers, and Server Actions must not read or mutate live stores.
Use deterministic serializable initial data; keep credentials and authoritative
server records out. Persistence and hydration changes require an explicit design.
Run `npm run test:state` for isolation, initialization, and subscription behavior.
See ADR 0007 and `docs/state-management.md`.
ADR 0008 allows persisting only the public theme enum in the client provider;
the factory itself must remain browser-independent with deterministic initial data.
