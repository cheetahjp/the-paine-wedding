import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
    ADMIN_SESSION_COOKIE,
    getAdminSessionCookieBaseOptions,
    getAdminSessionCookieDomain,
    verifyAdminSessionToken,
} from "@/lib/admin/session";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const session = verifyAdminSessionToken(token);

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized." },
            {
                status: 401,
                headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
            }
        );
    }

    return NextResponse.json(
        { role: session.role },
        {
            status: 200,
            headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
        }
    );
}


export async function DELETE() {
    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.cookies.set({
        ...getAdminSessionCookieBaseOptions(),
        value: "",
        domain: getAdminSessionCookieDomain(),
        maxAge: 0,
    });
    response.cookies.set({
        ...getAdminSessionCookieBaseOptions(),
        value: "",
        maxAge: 0,
    });

    return response;
}
