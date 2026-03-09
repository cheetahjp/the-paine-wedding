export type TriviaQuestion = {
    prompt: string;
    answers: [string, string, string, string];
    correctIndex: number;
    funFact?: string;
};

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
    {
        prompt: 'Who said "I love you" first?',
        answers: ["Jeffrey", "Ashlyn", "They said it together", "Nobody remembers"],
        correctIndex: 0,
        funFact: "Jeffrey got there first.",
    },
    {
        prompt: "Who is the better cook?",
        answers: ["Jeffrey", "Ashlyn", "They are evenly matched", "Whoever orders takeout"],
        correctIndex: 1,
        funFact: "Ashlyn holds the edge in the kitchen.",
    },
    {
        prompt: "Where was their first official date?",
        answers: ["Sonic and a long drive", "Galveston Bay Brewing", "60 Vines", "An A&M football game"],
        correctIndex: 0,
        funFact: "Their first official date was simple and turned into hours of conversation.",
    },
    {
        prompt: "Which movie is one of their favorites together?",
        answers: ["Pride & Prejudice", "Interstellar", "The Notebook", "Inception"],
        correctIndex: 3,
        funFact: "Inception made the official favorites list.",
    },
    {
        prompt: "Who takes longer to get ready?",
        answers: ["Jeffrey", "Ashlyn", "They tie", "It depends on the day"],
        correctIndex: 1,
        funFact: "Ashlyn takes the longer getting-ready route.",
    },
    {
        prompt: "Where did Jeffrey and Ashlyn first meet?",
        answers: ["Texas A&M University-Commerce", "Davis & Grey Farms", "Arbor Hills", "Galveston Bay Brewing"],
        correctIndex: 0,
        funFact: "It started with an ice cream social at Texas A&M University-Commerce in 2021.",
    },
    {
        prompt: "How far did Jeffrey drive for their reunion date in Houston?",
        answers: ["2 hours", "3 hours", "4.5 hours", "6 hours"],
        correctIndex: 2,
        funFact: "Jeffrey made the four-and-a-half-hour drive for the reunion date.",
    },
    {
        prompt: "Where did Jeffrey propose?",
        answers: ["60 Vines", "Arbor Hills Nature Preserve", "Davis & Grey Farms", "At an A&M game"],
        correctIndex: 1,
        funFact: "Ashlyn was guided down the path at Arbor Hills before seeing Jeffrey waiting there.",
    },
    {
        prompt: "When did they officially start dating again?",
        answers: ["August 2024", "October 18, 2024", "February 21, 2026", "September 26, 2026"],
        correctIndex: 1,
        funFact: "After reconnecting, they officially started dating again on October 18, 2024.",
    },
    {
        prompt: "At the football game, how far apart were they sitting?",
        answers: ["One row", "Three rows", "Five rows", "Ten rows"],
        correctIndex: 2,
        funFact: "Out of 100,000 people, they ended up only five rows apart.",
    },
];
