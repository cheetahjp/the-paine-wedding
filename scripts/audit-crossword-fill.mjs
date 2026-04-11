#!/usr/bin/env node
// scripts/audit-crossword-fill.mjs
// Flags weak / archaic / crossword-ese fill in the puzzle bank.
// Usage: node scripts/audit-crossword-fill.mjs

import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync("src/lib/games/crossword.ts", "utf8");
const match = source.match(/const RAW_PUZZLES: RawPuzzleData\[] = (\[[\s\S]*?\n\]);/);
const puzzles = vm.runInNewContext(match[1]);

// Known weak / crossword-ese fill. Categories roughly:
//   A = archaic / obsolete ("ERE", "EEN", "SER")
//   B = obscure animals / plants ("ANI", "OKAPI", "OCA")
//   C = abbreviations masquerading as words ("SER", "REF", "ESS")
//   D = onomatopoeic / sound words ("REE", "ARF", "BAA", "MEW")
//   E = prefixes / suffixes / word fragments ("RETS", "ETS")
//   F = three-letter Greek / music filler ("ETA", "EDO", "ALB")
//   G = plurals / tenses of already-weak words
const WEAK_FILL = new Set([
  // archaic / obsolete
  "ERE", "EEN", "YEA", "NAY", "OFT", "ANON", "NEER", "NEE", "OER",
  "SER", "SRI", "SAHIB", "SIR", "EBON", "EEN", "ETH", "ETS",
  // crow/horse/sheep calls
  "REE", "BAA", "ARF", "MOO", "NEIGH", "MEOW", "MEW", "CAW", "OINK",
  // classic crossword-ese
  "ESS", "EEL", "ELS", "AAHS", "OHS", "AHS", "ELHI", "ETUI", "ORT", "ORTS",
  "ANI", "ANIS", "ASEA", "ALEE", "AFORE", "ABAFT", "ASTERN", "AWASH",
  "STET", "ERGO", "ERGOT", "ERGS", "ENOL", "ENATE", "ENOS",
  // obscure plants / animals
  "OCA", "OKA", "UDO", "ULE", "EYRA", "ANOA", "ADDAX", "MARA",
  "ASP", "ASPS", "EWT", "WREN",
  // Greek letters / musical notes
  "ETA", "IOTA", "PHI", "CHI", "PSI", "RHO", "TAU", "XI", "ZETA",
  "DO", "RE", "MI", "FA", "SO", "LA", "TI", "SOL",
  // obscure place names / abbr
  "LLANO", "EDO", "UTE", "OSAGE", "ERIE", "ARAL", "AEGEAN",
  // overused clue-enablers
  "OREO", "AJAR", "EERIE", "EPEE", "ETCHER", "OBOE", "OBOES",
  "ODE", "ODES", "ATE", "EAT", "EEL", "OAR", "OARS",
  "AGORA", "AORTA", "ATONE", "ATONED", "ARENA", "AROMA", "APRON",
  "OVATE", "OLEO", "AREA", "ARIA", "ARIAS",
  // prefixes / fragments
  "INRE", "INRI", "TRE", "DEI", "ENS", "ENA", "ALER", "ALEE",
  // questionable short fill
  "OHO", "AHA", "HAH", "HEH", "OXO", "ELS", "ARS",
]);

// Build a word frequency map + puzzle locations
const wordFreq = {};      // word -> count
const wordLocations = {}; // word -> [puzzle ids]

for (const puzzle of puzzles) {
  for (const entry of puzzle.words) {
    const w = entry.word;
    wordFreq[w] = (wordFreq[w] || 0) + 1;
    if (!wordLocations[w]) wordLocations[w] = [];
    wordLocations[w].push(puzzle.id);
  }
}

const totalWords = Object.keys(wordFreq).length;
const weakHits = Object.entries(wordFreq)
  .filter(([w]) => WEAK_FILL.has(w))
  .sort((a, b) => b[1] - a[1]);

const weakInstances = weakHits.reduce((sum, [, c]) => sum + c, 0);

console.log(`Bank has ${puzzles.length} puzzles using ${totalWords} unique words.`);
console.log(`Weak fill: ${weakHits.length} unique words, ${weakInstances} total instances.\n`);

console.log("TOP WEAK FILL (most frequent first):");
for (const [word, count] of weakHits) {
  const locs = wordLocations[word].slice(0, 5).join(", ");
  const more = wordLocations[word].length > 5 ? `, +${wordLocations[word].length - 5} more` : "";
  console.log(`  ${word.padEnd(6)} ${String(count).padStart(3)}x  →  ${locs}${more}`);
}

// Also list any non-weak word that appears > 10 times (overuse warning)
const overused = Object.entries(wordFreq)
  .filter(([w, c]) => c > 10 && !WEAK_FILL.has(w))
  .sort((a, b) => b[1] - a[1]);

if (overused.length > 0) {
  console.log("\nOVERUSED (non-weak words appearing > 10 times):");
  for (const [word, count] of overused) {
    console.log(`  ${word.padEnd(6)} ${String(count).padStart(3)}x`);
  }
}
