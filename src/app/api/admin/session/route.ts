import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
    ADMIN_SESSION_COOKIE,
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
    const domain = getAdminSessionCookieDomain();
    const isProduction = process.env.NODE_ENV === "production";

    // Use response.headers.append so both Set-Cookie headers are sent.
    // response.cookies.set() de-dupes by name, meaning the second call would
    // silently overwrite the first — leaving the domain-scoped cookie alive.
    const base = `${ADMIN_SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${isProduction ? "; Secure" : ""}`;

    if (domain) {
        // Clear the domain-scoped cookie (how it is set on login in production)
        response.headers.append("Set-Cookie", `${base}; Domain=${domain}`);
    }
    // Clear any host-only cookie (dev mode or legacy)
    response.headers.append("Set-Cookie", base);

    return response;
}
