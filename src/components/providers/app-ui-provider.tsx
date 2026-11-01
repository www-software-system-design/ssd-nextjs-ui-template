"use client";

import {
  UIProvider,
  type UIProviderProps,
} from "@software-system.design/ui/provider";
import { themeScopeBootstrapHtml } from "@/config/theme";
import { useUiStore } from "./ui-store-provider";

export function AppUiProvider(
  props: Omit<UIProviderProps, "theme" | "suppressHydrationWarning">,
) {
  const theme = useUiStore((state) => state.theme);

  return (
    <UIProvider {...props} theme={theme} suppressHydrationWarning>
      {/* Static HTML executes only during document parsing, not client navigation.
          The provider's layout effect restores the theme on client remounts. */}
      <span
        hidden
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: themeScopeBootstrapHtml }}
      />
      {props.children}
    </UIProvider>
  );
}
