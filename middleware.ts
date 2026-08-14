import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { track, buildPayload } from "tashrif";

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    const { payload, setCookies } = buildPayload(request);
    for (const c of setCookies ?? []) response.cookies.set(c.name, c.value, c.options);
    void track(payload);

    return response;
}

export const config = {
    matcher: ["/"],
};
