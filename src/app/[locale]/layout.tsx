import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { locales, localeDirections } from "@/config/i18n";
import { getDictionary } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import { UiStoreProvider } from "@/components/providers/ui-store-provider";
import { DisplayDensityControl } from "@/components/preferences/display-density-control";
import { AppContent } from "@/components/app-content";
import { AppUiProvider } from "@/components/providers/app-ui-provider";
import { ThemeSetting } from "@/components/preferences/theme-setting";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  manifest: "/manifest.webmanifest",
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
    <html
      lang={locale}
      dir={direction}
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body>
        <UiStoreProvider
          key={locale}
          initialState={{ density: "comfortable", theme: "light" }}
        >
          <AppUiProvider
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
                <Link
                  href={`/${locale}`}
                  className="flex items-center gap-3 font-semibold"
                >
                  <Image
                    src="/ssd-logo.jpeg"
                    alt=""
                    width={48}
                    height={48}
                    loading="eager"
                    className="size-12 rounded-lg object-contain"
                  />
                  <span>{siteConfig.name}</span>
                </Link>
                <div className="flex flex-wrap items-center gap-4">
                  <ThemeSetting messages={d.theme} />
                  <DisplayDensityControl label={d.nav.compactView} />
                </div>
              </div>
            </header>
            <AppContent>{children}</AppContent>
            <footer className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-6 text-sm">
              <p className="min-w-0">{d.common.footer}</p>
              <Suspense
                fallback={<div className="h-11 w-24" aria-hidden="true" />}
              >
                <LanguageSwitcher label={d.nav.language} />
              </Suspense>
            </footer>
          </AppUiProvider>
        </UiStoreProvider>
      </body>
    </html>
  );
}
