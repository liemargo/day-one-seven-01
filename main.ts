// Entry program for the "Day one, day seven" TikTok bounty on make.fun.
//
// The deliverable of this entry is the video itself; this small program is
// only the messenger. It takes VIDEO.json, which sits beside it in the
// repository and names the entry video's address, and places a copy of it
// in the output directory, where the competition's gate looks for it.
//
// Where the two directories live is decided by the environment:
//   MAKEFUN_BOT_DIR    the repository root (default /bot)
//   MAKEFUN_OUTPUT_DIR where the copy goes (default /output)
// Nothing is printed when the copy succeeds. Any problem is reported on
// stderr and the process exits with status 1. The program uses nothing
// but the Node standard library, touches no network and reads no clock,
// so the same input always produces the same result.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FILE_NAME = "VIDEO.json";

const sourceDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const sourcePath = join(sourceDir, FILE_NAME);

try {
  // Read the file first and check it really is a JSON object naming a
  // video address; a malformed file should fail here with a clear word
  // instead of being handed on to the gate.
  const raw = readFileSync(sourcePath, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as { url?: unknown }).url !== "string"
  ) {
    throw new Error(`${FILE_NAME} must be a JSON object with a string "url"`);
  }
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(join(targetDir, FILE_NAME), raw);
} catch (problem) {
  const reason = problem instanceof Error ? problem.message : String(problem);
  console.error(`main.ts: could not deliver ${FILE_NAME}: ${reason}`);
  process.exit(1);
}
