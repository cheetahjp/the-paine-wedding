"use client";

import { useEffect, useState } from "react";
import { getTimeRemaining, getTriviaUnlockDate, TRIVIA_UNLOCK_LABEL } from "@/lib/games/schedule";

type TriviaGateProps = {
    children: React.ReactNode;
};

export default function TriviaGate({ children }: TriviaGateProps) {
    const [remaining, setRemaining] = useState(() => getTimeRemaining(getTriviaUnlockDate()));

    useEffect(() => {
        const interval = window.setInterval(() => {
            setRemaining(getTimeRemaining(getTriviaUnlockDate()));
        }, 1000);

        return () => window.clearInterval(interval);
    }, []);

    if (remaining.isUnlocked) {
        return <>{children}</>;
    }

    return (
        <div className="rounded-[2rem] border border-primary/15 bg-white p-8 md:p-10 shadow-[0_20px_60px_rgba(20,42,68,0.08)]">
            <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Locked</p>
            <h2 className="mt-4 font-heading text-4xl text-primary">Trivia Opens Wedding Day</h2>
            <p className="mt-4 max-w-2xl text-text-secondary leading-relaxed">
                This game goes live on {TRIVIA_UNLOCK_LABEL}. The countdown on the hub will keep ticking until then.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                    { label: "Days", value: remaining.days },
                    { label: "Hours", value: remaining.hours },
                    { label: "Minutes", value: remaining.minutes },
                    { label: "Seconds", value: remaining.seconds },
                ].map((item) => (
                    <div key={item.label} className="rounded-[1.5rem] bg-surface p-5 text-center">
                        <p className="font-heading text-4xl text-primary">{item.value}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-text-secondary">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
