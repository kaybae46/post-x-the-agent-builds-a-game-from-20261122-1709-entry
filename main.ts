// Entry point for the make.fun "agent builds a game from one prompt" bounty.
//
// What this little program is for: the house only needs to find POST.json in the
// output folder. That file names the X post where the game video lives, and the
// gate reads the post's views and replies straight from X. So the whole job here
// is to carry POST.json from the repo root into the output folder, unchanged.
//
// It runs under Node 22 with nothing but the standard library. It touches no
// network, reads no clock, and writes nothing except the one copied file, so
// running it twice produces identical bytes.
//
// Local equivalent of the grader's run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Where the repo lives inside the grader container, and where the copied
// file must land. Both can be overridden for local runs.
const repoDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

let payload: Buffer;
try {
  payload = readFileSync(join(repoDir, 'POST.json'));
} catch (err) {
  fail(`Could not read POST.json from ${repoDir}: ${(err as Error).message}`);
}

try {
  writeFileSync(join(outDir, 'POST.json'), payload);
} catch (err) {
  fail(`Could not write POST.json into ${outDir}: ${(err as Error).message}`);
}
