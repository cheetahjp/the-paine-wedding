import { NextRequest, NextResponse } from "next/server";
import { isValidDictionaryGuess } from "@/lib/games/dictionary";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const word = typeof body?.word === "string" ? body.word.trim().toLowerCase() : "";

        if (!word) {
            return NextResponse.json({ valid: false, error: "Word is required." }, { status: 400 });
        }

        return NextResponse.json({ valid: isValidDictionaryGuess(word) }, { status: 200 });
    } catch {
        return NextResponse.json({ valid: false, error: "Invalid request." }, { status: 400 });
    }
}
