// News-image entry for Monday, 23 November 2026 (Node 22, standard library
// only). The image is the entry.png beside this file: a PIL-rendered front
// page with six verified stories from that day. The program copies it to the
// grader's output directory.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const src = new URL('./entry.png', import.meta.url);

// Guard the gate before copying: the file must be a whole PNG within the
// competition's limits (at most 1 MiB, at most 1024 by 1024 pixels).
const bytes = readFileSync(src);
if (bytes.length > 1048576) throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
if (!bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
  throw new Error('entry.png is not a PNG (bad magic bytes)');
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > 1024 || height > 1024) throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 cap`);
console.log(`entry.png: PNG ${width}x${height}, ${bytes.length} bytes`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, 'entry.png'));
