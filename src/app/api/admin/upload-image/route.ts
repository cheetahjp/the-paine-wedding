import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin/session";

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

/**
 * POST /api/admin/upload-image
 * Body: multipart/form-data with:
 *   file  — the image file
 *   path  — (optional) storage path, e.g. "hero/hero-main.jpg"
 *            Defaults to "uploads/{timestamp}-{filename}"
 *
 * Returns: { url: string }
 */
export async function POST(request: NextRequest) {
    const supabase = await getAdminSupabase();
    if (!supabase) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const pathOverride = formData.get("path");

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "file is required." }, { status: 400 });
        }

        const ext = file.name.split(".").pop() ?? "jpg";
        const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, "-").toLowerCase();
        const storagePath =
            typeof pathOverride === "string" && pathOverride.trim()
                ? pathOverride.trim()
                : `uploads/${Date.now()}-${safeName}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { data, error } = await supabase.storage
            .from("site-images")
            .upload(storagePath, buffer, {
                contentType: file.type || `image/${ext}`,
                upsert: true,
            });

        if (error) throw error;

        const { data: urlData } = supabase.storage
            .from("site-images")
            .getPublicUrl(data.path);

        return NextResponse.json({ url: urlData.publicUrl, path: data.path });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
