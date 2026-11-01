"use client";

import type { ReactNode } from "react";
import { useUiStore } from "@/components/providers/ui-store-provider";

// Apply the application's page-spacing preference without changing shared control internals.
export function AppContent({ children }: { children: ReactNode }) {
  const density = useUiStore((state) => state.density);

  return (
    <div
      data-density={density}
      className={
        density === "compact"
          ? "flex flex-1 flex-col [&_main]:py-8"
          : "flex flex-1 flex-col [&_main]:py-16"
      }
    >
      {children}
    </div>
  );
}
