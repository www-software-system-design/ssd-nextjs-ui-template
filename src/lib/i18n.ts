import "server-only";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/i18n";
import { getMessages } from "./messages";

export type { Dictionary } from "./messages";

export function getDictionary(value: string) {
  if (!isLocale(value)) notFound();
  return getMessages(value);
}
