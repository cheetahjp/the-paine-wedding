import { WEDDING } from "@/lib/wedding-data";

export const TRIVIA_UNLOCK_AT = `${WEDDING.date.iso}T00:00:00-05:00`;
export const TRIVIA_UNLOCK_LABEL = WEDDING.date.display;

export function getTriviaUnlockDate() {
    return new Date(TRIVIA_UNLOCK_AT);
}

export function getTimeRemaining(targetDate: Date) {
    const now = Date.now();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
        return {
            isUnlocked: true,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
    }

    return {
        isUnlocked: false,
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
    };
}
