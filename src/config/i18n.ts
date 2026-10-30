export const locales = ["en", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
};
export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  hi: "ltr",
};
export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}
