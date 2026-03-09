import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

export type TriviaQuestionRow = {
    id: string;
    prompt: string;
    answer_a: string;
    answer_b: string;
    answer_c: string;
    answer_d: string;
    correct_index: number;
    fun_fact: string | null;
    sort_order: number;
    archived: boolean;
    created_at: string;
    updated_at: string;
};

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder") || supabaseKey === "placeholder") {
        return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
            .from("trivia_questions")
            .select("*")
            .eq("archived", false)
            .order("sort_order", { ascending: true });

        if (error) throw error;

        return NextResponse.json({ questions: data as TriviaQuestionRow[] }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Could not load trivia questions.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
