import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    const body = await req.json() as { household_id?: string };
    if (!body.household_id) return NextResponse.json({ error: "Missing household_id" }, { status: 400 });

    const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await sb.from("guests")
        .update({ viewed_rsvp: true })
        .eq("household_id", body.household_id);

    return NextResponse.json({ ok: true });
}
