# Application preference controls

These adapters connect public shared-library controls to application preferences.
Keep generic visual behavior in the UI package. Subscribe to specific store fields
and actions, localize labels, and expose toggle state through native ARIA semantics.
Never use preference state for server-side identity, authorization, or validation.
ThemeSetting consumes the public ThemeToggle with sun/moon icons and translated
action labels; Light is the default and Dark is the other choice (ADR 0009).
