"use client";

import { ThemeToggle } from "@software-system.design/ui/theme-toggle";
import type { Dictionary } from "@/lib/messages";
import { useUiStore } from "@/components/providers/ui-store-provider";

export function ThemeSetting({ messages }: { messages: Dictionary["theme"] }) {
  const theme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);

  return (
    <ThemeToggle
      id="app-theme"
      theme={theme}
      label={theme === "dark" ? messages.switchToLight : messages.switchToDark}
      onThemeChange={setTheme}
    />
  );
}
