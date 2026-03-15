/**
 * Crossword puzzle generator — prints all valid puzzle combinations as JSON.
 * Run: node scripts/generate-crosswords.mjs
 */

const WORDS = [
  "abide","adore","agape","aglow","aisle","altar","amber","amity",
  "amour","angel","arise","aspen","baker","beach","bells","berry",
  "bible","blaze","bless","bliss","bloom","blush","bread","bride",
  "cakes","candy","cedar","charm","cheer","chill","choir","chord",
  "cider","clean","clear","clink","cloud","coast","color","comfy",
  "coral","cream","crisp","cross","crown","crust","dance","dates",
  "delta","dream","dress","drink","drive","earth","ember","enjoy",
  "faith","favor","feast","field","flair","flour","flute","focus",
  "forge","forth","found","frame","fresh","frost","fruit","games",
  "glass","gleam","glory","grace","grain","grape","grass","great",
  "groom","guest","guide","heart","hills","honey","honor","house",
  "humor","ideal","image","inner","ivory","juice","knelt","known",
  "laugh","layer","lemon","light","linen","lived","loved","lover",
  "lucky","lyric","magic","mango","maple","march","marry","match",
  "merit","merry","might","mirth","movie","music","noble","north",
  "ocean","olive","order","party","pasta","pause","peace","peach",
  "pearl","petal","piano","pizza","plant","plate","point","power",
  "pride","prime","proud","queen","raise","ranch","ready","renew",
  "rhyme","rings","river","roast","robin","roses","rusty","saint",
  "salty","scent","serve","share","shine","shore","shout","smile",
  "sonic","sound","spark","spice","stone","story","sugar","sweet",
  "swing","table","taste","tears","thank","theme","thyme","toast",
  "today","token","touch","trace","trail","truth","twirl","unity",
  "valor","value","venue","views","vital","voice","vowed","waltz",
  "water","wheat","while","whole","worth","yearn","young","zesty",
];

const patternIndex = new Map();
for (const word of WORDS) {
  const key = `${word[0]}?${word[2]}?${word[4]}`;
  if (!patternIndex.has(key)) patternIndex.set(key, []);
  patternIndex.get(key).push(word);
}

const solutions = [];
const usedSets = new Set();

const n = WORDS.length;
for (let i = 0; i < n; i++) {
  const a1 = WORDS[i];
  for (let j = 0; j < n; j++) {
    if (j === i) continue;
    const a2 = WORDS[j];
    for (let k = 0; k < n; k++) {
      if (k === i || k === j) continue;
      const a3 = WORDS[k];

      const d1key = `${a1[0]}?${a2[0]}?${a3[0]}`;
      const d2key = `${a1[2]}?${a2[2]}?${a3[2]}`;
      const d3key = `${a1[4]}?${a2[4]}?${a3[4]}`;

      const d1c = patternIndex.get(d1key) || [];
      const d2c = patternIndex.get(d2key) || [];
      const d3c = patternIndex.get(d3key) || [];
      if (!d1c.length || !d2c.length || !d3c.length) continue;

      const acrossSet = new Set([a1, a2, a3]);

      for (const d1 of d1c) {
        if (acrossSet.has(d1)) continue;
        const withD1 = new Set([...acrossSet, d1]);
        for (const d2 of d2c) {
          if (withD1.has(d2)) continue;
          const withD2 = new Set([...withD1, d2]);
          for (const d3 of d3c) {
            if (withD2.has(d3)) continue;
            const setKey = [a1,a2,a3,d1,d2,d3].sort().join(",");
            if (usedSets.has(setKey)) continue;
            usedSets.add(setKey);
            solutions.push({ a1, a2, a3, d1, d2, d3 });
          }
        }
      }
    }
  }
}

// Print all solutions as a compact list
console.log(`// ${solutions.length} valid puzzle combinations\n`);
solutions.forEach((s, idx) => {
  console.log(`${idx+1}. ACROSS: ${s.a1}/${s.a2}/${s.a3}  DOWN: ${s.d1}/${s.d2}/${s.d3}`);
});
