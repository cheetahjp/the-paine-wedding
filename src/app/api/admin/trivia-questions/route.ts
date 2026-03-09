import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin/session";

type TriviaQuestionInsert = {
    prompt: string;
    answer_a: string;
    answer_b: string;
    answer_c: string;
    answer_d: string;
    correct_index: number;
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

export async function GET() {
    const supabase = await getAdminSupabase();

    if (!supabase) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from("trivia_questions")
            .select("*")
            .order("sort_order", { ascending: true });

        if (error) throw error;

        return NextResponse.json({ questions: data }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Could not load questions.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const supabase = await getAdminSupabase();

    if (!supabase) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    try {
        const body = await request.json() as Partial<TriviaQuestionInsert>;
        const { prompt, answer_a, answer_b, answer_c, answer_d, correct_index, fun_fact, sort_order } = body;

        if (!prompt?.trim() || !answer_a?.trim() || !answer_b?.trim() || !answer_c?.trim() || !answer_d?.trim()) {
            return NextResponse.json({ error: "Prompt and all four answers are required." }, { status: 400 });
        }

        if (typeof correct_index !== "number" || correct_index < 0 || correct_index > 3) {
            return NextResponse.json({ error: "correct_index must be 0, 1, 2, or 3." }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("trivia_questions")
            .insert({
                prompt: prompt.trim(),
                answer_a: answer_a.trim(),
                answer_b: answer_b.trim(),
                answer_c: answer_c.trim(),
                answer_d: answer_d.trim(),
                correct_index,
                fun_fact: fun_fact?.trim() || null,
                sort_order: sort_order ?? 0,
                archived: false,
            })
            .select("*")
            .single();

        if (error) throw error;

        return NextResponse.json({ question: data }, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Could not create question.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
