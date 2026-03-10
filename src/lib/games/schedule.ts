import { WEDDING } from "@/lib/wedding-data";

const WEDDING_DAY_AT = `${WEDDING.date.iso}T00:00:00-05:00`;
export const TRIVIA_UNLOCK_AT = WEDDING_DAY_AT;
export const TRIVIA_UNLOCK_LABEL = WEDDING.date.display;
export const CROSSWORD_UNLOCK_AT = getDateDaysBeforeWedding(7).toISOString();
export const CROSSWORD_UNLOCK_LABEL = getDateDaysBeforeWedding(7).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
});

export function getTriviaUnlockDate() {
    return new Date(TRIVIA_UNLOCK_AT);
}

export function getCrosswordUnlockDate() {
    return new Date(CROSSWORD_UNLOCK_AT);
}

function getDateDaysBeforeWedding(daysBeforeWedding: number) {
    const weddingDate = new Date(WEDDING_DAY_AT);
    weddingDate.setDate(weddingDate.getDate() - daysBeforeWedding);
    return weddingDate;
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
