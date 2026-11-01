import { createStore } from "zustand/vanilla";
import type { ThemePreference } from "@/config/theme";

export type DisplayDensity = "comfortable" | "compact";

export type UiPreferences = {
  density: DisplayDensity;
  theme: ThemePreference;
};

export type UiStore = UiPreferences & {
  setDensity: (density: DisplayDensity) => void;
  setTheme: (theme: ThemePreference) => void;
};

// Export a factory, never a shared instance: concurrent renders need isolated stores.
export function createUiStore(
  initialState: UiPreferences = { density: "comfortable", theme: "light" },
) {
  return createStore<UiStore>()((set) => ({
    density: initialState.density,
    theme: initialState.theme,
    setDensity: (density) => set({ density }),
    setTheme: (theme) => set({ theme }),
  }));
}
