import { NextRequest, NextResponse } from "next/server";

// Passwords are stored server-side in environment variables.
// Set these in .env.local (local dev) and in Vercel project settings (production).
// They are NEVER sent to the browser.
const PASSWORD_MAP: Record<string, string> = {
    [process.env.ADMIN_PASSWORD_MASTER ?? ""]: "Master",
    [process.env.ADMIN_PASSWORD_1 ?? ""]: "User 1",
    [process.env.ADMIN_PASSWORD_2 ?? ""]: "User 2",
    [process.env.ADMIN_PASSWORD_3 ?? ""]: "User 3",
    [process.env.ADMIN_PASSWORD_4 ?? ""]: "User 4",
    [process.env.ADMIN_PASSWORD_5 ?? ""]: "User 5",
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const password: string = (body?.password ?? "").trim();

        if (!password) {
            return NextResponse.json({ error: "Password is required." }, { status: 400 });
        }

        const role = PASSWORD_MAP[password];

        if (!role) {
            // Consistent timing to prevent password enumeration
            await new Promise((r) => setTimeout(r, 300));
            return NextResponse.json({ error: "Invalid password." }, { status: 401 });
        }

        return NextResponse.json({ role }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
}
