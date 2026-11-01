"use client";

import { useTransition } from "react";
import { SelectField } from "@software-system.design/ui/select-field";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { defaultLocale, isLocale, locales, localeLabels } from "@/config/i18n";

// The MFE owns navigation because the UI library has no Next.js dependency.
export function LanguageSwitcher({ label }: { label: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const query = useSearchParams().toString();
  const segment = pathname.split("/")[1] ?? "";
  const currentLocale = isLocale(segment) ? segment : defaultLocale;
  const suffix = pathname.split("/").slice(2).join("/");
  return (
    <SelectField
      id="app-language"
      label={label}
      value={currentLocale}
      disabled={pending}
      aria-busy={pending}
      wrapperClassName="w-24 [&>label]:sr-only"
      style={{
        // Inset the native arrow; keep the visible border at the control's outer edge.
        borderColor: "transparent",
        borderInlineEndWidth: "var(--ssd-space-3)",
        boxShadow: "0 0 0 1px var(--ssd-color-border)",
      }}
      onChange={(event) => {
        const locale = event.target.value;
        if (!isLocale(locale) || locale === currentLocale) return;
        // Only replace the locale; keep the current page, query, hash, and scroll.
        const href =
          `/${locale}${suffix ? `/${suffix}` : ""}${query ? `?${query}` : ""}${window.location.hash}` as Route;
        startTransition(() => router.push(href, { scroll: false }));
      }}
    >
      {locales.map((locale) => {
        return (
          <option
            key={locale}
            value={locale}
            lang={locale}
            aria-label={localeLabels[locale]}
          >
            {locale.toUpperCase()}
          </option>
        );
      })}
    </SelectField>
  );
}
