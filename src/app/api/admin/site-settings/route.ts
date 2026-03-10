import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin/session";
import { revalidatePath } from "next/cache";

async function getAdminSupabase() {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const session = verifyAdminSessionToken(token);
    if (!session) return null;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) return null;

    return createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
}

/** GET /api/admin/site-settings — return all settings as { key: value } map */
export async function GET() {
    const supabase = await getAdminSupabase();
    if (!supabase) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    try {
        const { data, error } = await supabase
            .from("site_settings")
            .select("key, value")
            .order("key");

        if (error) throw error;

        const settings: Record<string, unknown> = {};
        for (const row of data ?? []) {
            settings[row.key as string] = row.value;
        }

        return NextResponse.json({ settings });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Could not load settings.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/** POST /api/admin/site-settings — upsert one setting: { key, value } */
export async function POST(request: NextRequest) {
    const supabase = await getAdminSupabase();
    if (!supabase) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    try {
        const body = await request.json() as { key?: string; value?: unknown };
        const { key, value } = body;

        if (typeof key !== "string" || !key.trim()) {
            return NextResponse.json({ error: "key is required." }, { status: 400 });
        }
        if (value === undefined) {
            return NextResponse.json({ error: "value is required." }, { status: 400 });
        }

        const { error } = await supabase
            .from("site_settings")
            .upsert({ key: key.trim(), value }, { onConflict: "key" });

        if (error) throw error;

        // Revalidate all public pages so changes take effect immediately
        revalidatePath("/", "layout");

        return NextResponse.json({ ok: true });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Could not save setting.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/** DELETE /api/admin/site-settings — delete one setting: { key } in body */
export async function DELETE(request: NextRequest) {
    const supabase = await getAdminSupabase();
    if (!supabase) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    try {
        const body = await request.json() as { key?: string };
        const { key } = body;

        if (typeof key !== "string" || !key.trim()) {
            return NextResponse.json({ error: "key is required." }, { status: 400 });
        }

        const { error } = await supabase
            .from("site_settings")
            .delete()
            .eq("key", key.trim());

        if (error) throw error;

        revalidatePath("/", "layout");

        return NextResponse.json({ ok: true });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Could not delete setting.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
