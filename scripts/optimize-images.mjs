/**
 * Converts all PNG/JPEG images in public/images to WebP
 * and resizes them to a max width of 1200px.
 * Run: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const INPUT_DIR  = './public/images';
const OUTPUT_DIR = './public/images';
const MAX_WIDTH  = 1200;

const files = readdirSync(INPUT_DIR).filter((f) =>
  ['.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase())
);

for (const file of files) {
  const input  = join(INPUT_DIR,  file);
  const output = join(OUTPUT_DIR, basename(file, extname(file)) + '.webp');

  const before = statSync(input).size;

  await sharp(input)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(output);

  const after = statSync(output).size;
  const saving = (((before - after) / before) * 100).toFixed(1);
  console.log(`✓ ${file} → ${basename(output)}  (${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB, -${saving}%)`);
}

console.log('\nDone. Update img src values to use .webp extensions.');
