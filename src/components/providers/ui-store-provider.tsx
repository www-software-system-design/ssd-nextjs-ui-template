"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import {
  createUiStore,
  type UiPreferences,
  type UiStore,
} from "@/lib/stores/ui-store";
import { parseThemePreference, themeStorageKey } from "@/config/theme";

type UiStoreApi = ReturnType<typeof createUiStore>;
const UiStoreContext = createContext<UiStoreApi | null>(null);

export function UiStoreProvider({
  initialState,
  children,
}: {
  initialState: UiPreferences;
  children: ReactNode;
}) {
  // Keep one instance for this mounted tree, initialized identically during SSR/hydration.
  const [store] = useState(() => createUiStore(initialState));

  useLayoutEffect(() => {
    let savedTheme = store.getState().theme;
    let storage: Storage | undefined;
    try {
      storage = window.localStorage;
      savedTheme = parseThemePreference(storage.getItem(themeStorageKey));
    } catch {
      // Storage may be disabled; the in-memory preference still works.
    }
    store.getState().setTheme(savedTheme);

    function applyTheme(theme: UiPreferences["theme"]) {
      document.documentElement.setAttribute("data-ssd-theme", theme);
      document.documentElement.style.colorScheme = theme;
    }
    applyTheme(savedTheme);

    const unsubscribe = store.subscribe((state, previous) => {
      if (state.theme === previous.theme) return;
      applyTheme(state.theme);
      try {
        storage?.setItem(themeStorageKey, state.theme);
      } catch {
        // Persistence is optional when browser storage is unavailable.
      }
    });
    function syncTheme(event: StorageEvent) {
      if (
        storage &&
        event.storageArea === storage &&
        (event.key === themeStorageKey || event.key === null)
      ) {
        store.getState().setTheme(parseThemePreference(event.newValue));
      }
    }
    window.addEventListener("storage", syncTheme);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", syncTheme);
    };
  }, [store]);

  return (
    <UiStoreContext.Provider value={store}>{children}</UiStoreContext.Provider>
  );
}

export function useUiStore<T>(selector: (state: UiStore) => T): T {
  const store = useContext(UiStoreContext);
  if (!store) {
    throw new Error("useUiStore must be used within UiStoreProvider");
  }
  return useStore(store, selector);
}
