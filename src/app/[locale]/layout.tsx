import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { UIProvider } from "@software-system.design/ui/provider";
import { siteConfig } from "@/config/site";
import { locales, localeDirections } from "@/config/i18n";
import { getDictionary } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale: value } = await params;
  const { locale, dictionary: d } = getDictionary(value);
  const direction = localeDirections[locale];
  return (
    <html lang={locale} dir={direction} className="h-full antialiased">
      <body>
        <UIProvider
          theme="system"
          locale={locale}
          direction={direction}
          messages={{ loading: d.common.loading }}
          className="flex min-h-dvh flex-col"
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:bg-background focus:p-3"
          >
            {d.common.skip}
          </a>
          <header className="border-b border-current/15">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-5 px-6 py-5">
              <Link href={`/${locale}`} className="font-semibold">
                {siteConfig.name}
              </Link>
              <Suspense fallback={null}>
                <LanguageSwitcher label={d.nav.language} />
              </Suspense>
            </div>
          </header>
          {children}
          <footer className="mx-auto w-full max-w-5xl px-6 py-6 text-sm">
            {d.common.footer}
          </footer>
        </UIProvider>
      </body>
    </html>
  );
}
