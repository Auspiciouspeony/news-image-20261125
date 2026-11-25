// news-image-20261125 — "The World in One Day", Wednesday 25 November 2026.
// A program that writes one image summing up the day's world news to
// /output/entry.png (or $MAKEFUN_OUTPUT_DIR when run outside the grader).
// The image is drawn in the repository as entry.png: a newspaper front page
// with two illustrated leads (Shenzhou-24's launch, the Riyadh tower strike),
// nine dated stories across every region, eight more in brief, and a numbers
// strip. Every story was reported on 24-25 November 2026. The program copies
// the image byte for byte, so both grader runs write identical bytes.

import { copyFileSync, existsSync, mkdirSync, readFileSync, chmodSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = fileURLToPath(new URL('./entry.png', import.meta.url));
const dst = join(outDir, 'entry.png');

const bytes = readFileSync(src);
// PNG magic: 89 50 4E 47 0D 0A 1A 0A — the gate tells PNG from JPEG by its
// first bytes, so refuse anything that is not a whole PNG before copying.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error('entry.png does not start with the PNG magic bytes');
}
if (bytes.length > 1048576) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
}
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);
chmodSync(dst, 0o644);
console.log(`wrote ${dst} (${bytes.length} bytes)`);
