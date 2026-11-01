"use client";

import { Button } from "@software-system.design/ui/button";
import { useUiStore } from "@/components/providers/ui-store-provider";

export function DisplayDensityControl({ label }: { label: string }) {
  const density = useUiStore((state) => state.density);
  const setDensity = useUiStore((state) => state.setDensity);

  return (
    <Button
      type="button"
      variant="secondary"
      aria-pressed={density === "compact"}
      onClick={() =>
        setDensity(density === "compact" ? "comfortable" : "compact")
      }
    >
      {label}
    </Button>
  );
}
