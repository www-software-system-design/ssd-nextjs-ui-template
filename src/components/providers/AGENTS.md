# Client state providers

Use `"use client"`. Create stores once per mounted provider with a lazy initializer;
never keep a module-level instance or synchronize changed seed props during render.
Pass identical public initial data through SSR and hydration. Accept server-rendered
children without importing their modules. Export a typed selector hook with a clear
missing-provider error. Choose provider lifetime and reset keys explicitly.
Read ADR 0007 and `docs/state-management.md` before changing state ownership.
ADR 0008 defines theme restoration in a layout effect and validated pre-paint scripts.
Only theme persists; do not broaden hydration suppression beyond html and the
AppUiProvider token-scope div. Keep script content static, and use the library theme
prop/tokens instead of recreating palettes. Restore storage on each mounted lifetime.
