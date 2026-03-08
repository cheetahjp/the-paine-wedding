import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin/session";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const session = verifyAdminSessionToken(token);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    return NextResponse.json({ role: session.role }, { status: 200 });
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.cookies.set({
        name: ADMIN_SESSION_COOKIE,
        value: "",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });

    return response;
}
