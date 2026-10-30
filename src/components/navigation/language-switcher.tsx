"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useSearchParams } from "next/navigation";
import { locales, localeLabels } from "@/config/i18n";

// The MFE owns navigation because the UI library has no Next.js dependency.
export function LanguageSwitcher({ label }: { label: string }) {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const suffix = pathname.split("/").slice(2).join("/");
  return (
    <nav className="flex gap-4" aria-label={label}>
      {locales.map((locale) => {
        // Replace only the known locale segment; preserve path and query.
        const href =
          `/${locale}${suffix ? `/${suffix}` : ""}${query ? `?${query}` : ""}` as Route;
        return (
          <Link
            key={locale}
            href={href}
            hrefLang={locale}
            aria-current={
              pathname.split("/")[1] === locale ? "page" : undefined
            }
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </nav>
  );
}
