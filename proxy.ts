import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { track, buildPayload } from "tashrif";

export function proxy(request: NextRequest, event: NextFetchEvent) {
    const response = NextResponse.next();

    const { payload, setCookies } = buildPayload(request);
    for (const c of setCookies ?? []) response.cookies.set(c.name, c.value, c.options);
    event.waitUntil(track(payload));

    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
