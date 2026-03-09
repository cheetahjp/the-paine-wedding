import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin/session";

type TriviaQuestionUpdate = {
    prompt?: string;
    answer_a?: string;
    answer_b?: string;
    answer_c?: string;
    answer_d?: string;
    correct_index?: number;
    fun_fact?: string | null;
    sort_order?: number;
    archived?: boolean;
};

async function getAdminSupabase() {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const session = verifyAdminSessionToken(token);

    if (!session) return null;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) return null;

    return createClient(supabaseUrl, serviceRoleKey);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await getAdminSupabase();

    if (!supabase) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json() as Partial<TriviaQuestionUpdate>;

        const update: Record<string, unknown> = {};

        if (typeof body.prompt === "string") update.prompt = body.prompt.trim();
        if (typeof body.answer_a === "string") update.answer_a = body.answer_a.trim();
        if (typeof body.answer_b === "string") update.answer_b = body.answer_b.trim();
        if (typeof body.answer_c === "string") update.answer_c = body.answer_c.trim();
        if (typeof body.answer_d === "string") update.answer_d = body.answer_d.trim();
        if (typeof body.correct_index === "number") update.correct_index = body.correct_index;
        if ("fun_fact" in body) update.fun_fact = body.fun_fact?.trim() || null;
        if (typeof body.sort_order === "number") update.sort_order = body.sort_order;
        if (typeof body.archived === "boolean") update.archived = body.archived;

        if (Object.keys(update).length === 0) {
            return NextResponse.json({ error: "No fields to update." }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("trivia_questions")
            .update(update)
            .eq("id", id)
            .select("*")
            .single();

        if (error) throw error;

        return NextResponse.json({ question: data }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Could not update question.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await getAdminSupabase();

    if (!supabase) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        const { id } = await params;

        const { error } = await supabase
            .from("trivia_questions")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Could not delete question.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
