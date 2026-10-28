import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/config/i18n";
export function proxy(request: NextRequest) {
  const segment = request.nextUrl.pathname.split("/")[1] ?? "";
  if (isLocale(segment)) return NextResponse.next();
  const preferred = request.headers
    .get("accept-language")
    ?.split(",")[0]
    ?.split("-")[0]
    ?.split(";")[0];
  const locale = preferred && isLocale(preferred) ? preferred : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.redirect(url);
}
export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
