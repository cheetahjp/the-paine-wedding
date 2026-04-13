#!/usr/bin/env node
/**
 * 5×5 crossword puzzle generator — produces 194 unique daily puzzles.
 * Run: node scripts/generate-crosswords.mjs > /tmp/puzzles.ts
 * Progress is logged to stderr; TypeScript output goes to stdout.
 */

// ======================================================================    }
  }

  const ordered = [];
  const placed = new Set();
  // Start with longest slot
  let startIdx = slotsWithCells.reduce((bi, s, i) => s.len > slotsWithCells[bi].len ? i : bi, 0);
  ordered.push(slotsWithCells[startIdx]);
  placed.add(startIdx);

  while (ordered.length < slotsWithCells.length) {
    let best = -1, bestScore = -1;
    for (let i = 0; i < slotsWithCells.length; i++) {
      if (placed.has(i)) continue;
      let score = 0;
      for (const ni of placed) {
        if (slotsWithCells[i]._neighbors.has(ni)) score++;
      }
      if (score > bestScore || (score === bestScore && best >= 0 && slotsWithCells[i].len > slotsWithCells[best].len)) {
        bestScore = score;
        best = i;
      }
    }
    ordered.push(slotsWithCells[best]);
    placed.add(best);
  }

  return ordered;
}

// ======================================================================      }
    }
  }

  // If pool exhausted, generate on the fly with random seed
  if (!result) {
    for (let attempt = 0; attempt < 1000 && !result; attempt++) {
      for (const tKey of templates) {
        const template = TEMPLATES[tKey];
        const slotIdx = Math.floor(Math.random() * template.slots.length);
        const slot = template.slots[slotIdx];
        const wordList = W[slot.n];
        const seedWord = wordList[Math.floor(Math.random() * wordList.length)];
        const r = solve(template, new Set(), slotIdx, seedWord);
        if (!r) continue;
        const sig = r.map(s => s.word).sort().join(",");
        if (!usedSigs.has(sig)) {
          result = r;
          usedTemplate = tKey;
          break;
        }
      }
    }
  }

  if (!result) {
    log(`FAILED at puzzle ${i + 1}`);
    process.exit(1);
  }

  const words = result.map(r => r.word);
  usedSigs.add(words.slice().sort().join(","));
  recentWords.push(words);
  if (recentWords.length > COOLDOWN) recentWords.shift();

  puzzles.push({ i, tKey: usedTemplate, result });
  log(`Puzzle ${String(i + 1).padStart(3)}/194 (${usedTemplate}) — ${usedSigs.size} unique`);
}

function nodes_debug() { return ""; }

// ======================================================================