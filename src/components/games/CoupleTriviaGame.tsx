"use client";

import { useState } from "react";
import { TRIVIA_QUESTIONS } from "@/lib/games/trivia-questions";
import ScoreSubmissionForm from "@/components/games/ScoreSubmissionForm";

const LETTERS = ["A", "B", "C", "D"] as const;

function getScoreMessage(score: number) {
    if (score <= 3) {
        return "A few table clues may have helped here. Try another round.";
    }

    if (score <= 6) {
        return "Solid score. You know the broad strokes of their story.";
    }

    if (score <= 8) {
        return "Strong work. You clearly know more than the average guest.";
    }

    return "Elite performance. That is inner-circle knowledge.";
}

export default function CoupleTriviaGame() {
    const [screen, setScreen] = useState<"welcome" | "playing" | "results">("welcome");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

    const currentQuestion = TRIVIA_QUESTIONS[currentIndex];
    const selectedAnswer = selectedAnswers[currentIndex];
    const answeredCount = selectedAnswers.length;
    const score = selectedAnswers.reduce((total, answer, index) => {
        return total + (answer === TRIVIA_QUESTIONS[index].correctIndex ? 1 : 0);
    }, 0);

    function handleStart() {
        setScreen("playing");
    }

    function handleRestart() {
        setScreen("welcome");
        setCurrentIndex(0);
        setSelectedAnswers([]);
    }

    function handleSelect(answerIndex: number) {
        if (selectedAnswer !== undefined) return;

        setSelectedAnswers((currentAnswers) => {
            const nextAnswers = [...currentAnswers];
            nextAnswers[currentIndex] = answerIndex;
            return nextAnswers;
        });
    }

    function handleNext() {
        if (currentIndex === TRIVIA_QUESTIONS.length - 1) {
            setScreen("results");
            return;
        }

        setCurrentIndex(currentIndex + 1);
    }

    if (screen === "welcome") {
        return (
            <div className="rounded-[2rem] border border-primary/10 bg-[linear-gradient(160deg,#fffaf4_0%,#f3ebe0_100%)] p-8 shadow-[0_20px_60px_rgba(20,42,68,0.10)] md:p-10">
                <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Welcome</p>
                <h2 className="mt-4 font-heading text-4xl text-primary">How Well Do You Know the Couple?</h2>
                <p className="mt-4 max-w-2xl text-text-secondary leading-relaxed">
                    Ten questions. Four answer choices each. Pick the best answer and see where your score lands.
                </p>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[1.5rem] border border-primary/8 bg-white/80 p-5">
                        <p className="text-sm uppercase tracking-[0.24em] text-text-secondary">Format</p>
                        <p className="mt-3 text-text-primary">Welcome, play, results.</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-primary/8 bg-white/80 p-5">
                        <p className="text-sm uppercase tracking-[0.24em] text-text-secondary">Questions</p>
                        <p className="mt-3 text-text-primary">{TRIVIA_QUESTIONS.length} multiple-choice prompts.</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-primary/8 bg-white/80 p-5">
                        <p className="text-sm uppercase tracking-[0.24em] text-text-secondary">Scoring</p>
                        <p className="mt-3 text-text-primary">Immediate feedback and a four-tier finish.</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleStart}
                    className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
                >
                    Start Trivia
                </button>
            </div>
        );
    }

    if (screen === "results") {
        return (
            <div className="rounded-[2rem] border border-primary/10 bg-[linear-gradient(160deg,#fffaf4_0%,#f3ebe0_100%)] p-8 shadow-[0_20px_60px_rgba(20,42,68,0.10)] md:p-10">
                <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Results</p>
                <h2 className="mt-4 font-heading text-4xl text-primary">{score} / {TRIVIA_QUESTIONS.length}</h2>
                <p className="mt-4 max-w-2xl text-text-secondary leading-relaxed">{getScoreMessage(score)}</p>

                <div className="mt-10 grid gap-4">
                    {TRIVIA_QUESTIONS.map((question, index) => {
                        const answerIndex = selectedAnswers[index];
                        const isCorrect = answerIndex === question.correctIndex;
                        const answerLabel = answerIndex !== undefined ? question.answers[answerIndex] : "No answer";

                        return (
                            <div key={question.prompt} className="rounded-[1.5rem] border border-primary/8 bg-white/80 p-5">
                                <p className="text-sm uppercase tracking-[0.24em] text-text-secondary">Question {index + 1}</p>
                                <h3 className="mt-2 font-heading text-2xl text-primary">{question.prompt}</h3>
                                <p className="mt-3 text-sm text-text-secondary">
                                    Your answer: <span className={isCorrect ? "text-primary" : "text-secondary"}>{answerLabel}</span>
                                </p>
                                {!isCorrect ? (
                                    <p className="mt-1 text-sm text-text-secondary">
                                        Correct answer: <span className="text-primary">{question.answers[question.correctIndex]}</span>
                                    </p>
                                ) : null}
                            </div>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={handleRestart}
                    className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
                >
                    Play Again
                </button>

                <div className="mt-8">
                    <ScoreSubmissionForm
                        game="trivia"
                        score={score}
                        maxScore={TRIVIA_QUESTIONS.length}
                        attempts={TRIVIA_QUESTIONS.length}
                        solved={score === TRIVIA_QUESTIONS.length}
                        puzzleKey="wedding-day-trivia"
                        metadata={{ question_count: TRIVIA_QUESTIONS.length }}
                        successMessage="Trivia score submitted."
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-[2rem] border border-primary/10 bg-[linear-gradient(160deg,#fffaf4_0%,#f3ebe0_100%)] p-8 shadow-[0_20px_60px_rgba(20,42,68,0.10)] md:p-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Playing</p>
                    <h2 className="mt-4 font-heading text-4xl text-primary">Question {currentIndex + 1}</h2>
                </div>
                <p className="text-sm uppercase tracking-[0.24em] text-text-secondary">
                    {answeredCount} of {TRIVIA_QUESTIONS.length} answered
                </p>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-surface">
                <div
                    className="h-full rounded-full bg-accent transition-all duration-300"
                    style={{ width: `${(answeredCount / TRIVIA_QUESTIONS.length) * 100}%` }}
                />
            </div>

            <div className="mt-8">
                <h3 className="font-heading text-4xl text-primary">{currentQuestion.prompt}</h3>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {currentQuestion.answers.map((answer, index) => {
                        const isSelected = index === selectedAnswer;
                        const isCorrect = index === currentQuestion.correctIndex;
                        const stateClass = selectedAnswer !== undefined
                            ? isCorrect
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : isSelected
                                    ? "border-secondary bg-secondary text-white"
                                    : "border-surface bg-surface text-text-primary"
                            : "border-primary/10 bg-white/88 text-text-primary hover:border-primary hover:bg-primary/5";

                        return (
                            <button
                                key={answer}
                                type="button"
                                onClick={() => handleSelect(index)}
                                className={`min-h-28 rounded-[1.5rem] border px-5 py-6 text-left transition-all duration-200 ${stateClass}`}
                            >
                                <p className="text-xs uppercase tracking-[0.3em] opacity-70">{LETTERS[index]}</p>
                                <p className="mt-3 text-lg leading-relaxed">{answer}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-surface pt-6 md:flex-row md:items-center md:justify-between">
                <div className="min-h-16 max-w-2xl text-text-secondary">
                    {selectedAnswer !== undefined && currentQuestion.funFact ? currentQuestion.funFact : "Choose an answer to reveal the fun fact."}
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleRestart}
                        className="inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={selectedAnswer === undefined}
                        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40 disabled:hover:translate-y-0"
                    >
                        {currentIndex === TRIVIA_QUESTIONS.length - 1 ? "See Results" : "Next Question"}
                    </button>
                </div>
            </div>
        </div>
    );
}
