export const themePreferences = ["light", "dark"] as const;
export type ThemePreference = (typeof themePreferences)[number];
export const themeStorageKey = "ssd-ui-theme";

export function parseThemePreference(value: unknown): ThemePreference {
  return themePreferences.find((theme) => theme === value) ?? "light";
}

// Only static application constants enter this script; no request/user content.
export const themeBootstrapScript = `(()=>{let theme="light";try{const saved=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(${JSON.stringify(themePreferences)}.includes(saved))theme=saved;}catch{}document.documentElement.setAttribute("data-ssd-theme",theme);document.documentElement.style.colorScheme=theme;})();`;

// Parse this before UIProvider's content: apply both document and scoped tokens.
// Static HTML avoids creating executable React script elements during navigation.
export const themeScopeBootstrapHtml = `<script>${themeBootstrapScript}document.currentScript?.parentElement?.parentElement?.setAttribute("data-ssd-theme",document.documentElement.getAttribute("data-ssd-theme")||"light");</script>`;
