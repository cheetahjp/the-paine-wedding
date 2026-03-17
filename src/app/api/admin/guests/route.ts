import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin/session";

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

async function verifyAdmin(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
        return verifyAdminSessionToken(token) !== null;
    } catch {
        return false;
    }
}

// PATCH /api/admin/guests
// Body: { id: string, updates: Partial<GuestUpdateFields> }
//   OR: { household_id: string, attending: boolean | null }  — bulk household RSVP update
export async function PATCH(req: NextRequest) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
        // Single guest update
        id?: string;
        updates?: {
            first_name?: string;
            last_name?: string;
            suffix?: string | null;
            attending?: boolean | null;
            food_allergies?: string | null;
            dietary_restrictions?: string | null;
            song_request?: string | null;
            advice?: string | null;
            plus_one_name?: string | null;
            plus_one_allowed?: boolean;
            affiliation?: string | null;
            side?: string | null;
            likelihood?: string | null;
            viewed_rsvp?: boolean;
            is_plus_one?: boolean;
            plus_one_for_id?: string | null;
            plus_one_claimed?: boolean;
        };
        // Household bulk RSVP update
        household_id?: string;
        household_attending?: boolean | null;
        // Household bulk text field update (song_request / advice)
        household_field?: string;
        household_value?: string | null;
    };

    const sb = getServiceClient();

    // Bulk household RSVP update
    if (body.household_id && "household_attending" in body) {
        const { error } = await sb
            .from("guests")
            .update({ attending: body.household_attending })
            .eq("household_id", body.household_id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
    }

    // Bulk household text field update
    if (body.household_id && body.household_field) {
        const allowedHouseholdFields = ["song_request", "advice"];
        if (!allowedHouseholdFields.includes(body.household_field)) {
            return NextResponse.json({ error: "Field not allowed for household update" }, { status: 400 });
        }
        const { error } = await sb
            .from("guests")
            .update({ [body.household_field]: body.household_value ?? null })
            .eq("household_id", body.household_id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
    }

    // Single guest update
    if (!body.id || !body.updates) {
        return NextResponse.json({ error: "Missing id or updates" }, { status: 400 });
    }

    // Whitelist the fields that can be edited
    const allowed = [
        "first_name", "last_name", "suffix", "attending",
        "food_allergies", "dietary_restrictions", "song_request", "advice",
        "plus_one_name", "plus_one_allowed", "affiliation", "side", "likelihood",
        "viewed_rsvp", "is_plus_one", "plus_one_for_id", "plus_one_claimed",
    ];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowed) {
        if (key in body.updates) {
            sanitized[key] = body.updates[key as keyof typeof body.updates];
        }
    }

    if (Object.keys(sanitized).length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const { error } = await sb
        .from("guests")
        .update(sanitized)
        .eq("id", body.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}

// DELETE /api/admin/guests?id=<uuid>
export async function DELETE(req: NextRequest) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const sb = getServiceClient();
    const { error } = await sb.from("guests").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
