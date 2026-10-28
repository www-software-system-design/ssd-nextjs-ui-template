import en from "@/contents/en.json";
import hi from "@/contents/hi.json";
import { defaultLocale, isLocale, type Locale } from "@/config/i18n";

export type Dictionary = typeof en;
const dictionaries: Record<Locale, Dictionary> = { en, hi };

export function getMessages(value: unknown) {
  const locale =
    typeof value === "string" && isLocale(value) ? value : defaultLocale;
  return { locale, dictionary: dictionaries[locale] };
}
