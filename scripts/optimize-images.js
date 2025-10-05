#!/usr/bin/env node
/*
  scripts/optimize-images.js
  - Generates AVIF and WebP variants for PNG/JPEG images using sharp
  - Converts GIFs and video files to WebM using ffmpeg when available
  - Writes a manifest to public/images/_optimized.json mapping originals -> variants

  Usage:
    node scripts/optimize-images.js [--threshold=200] [--dry]

  Notes:
   - Requires `sharp` installed (it is listed in package.json). ffmpeg is optional.
   - By default only processes source files > threshold KB (default 200 KB) to save time.
*/

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const os = require('os');

const sharp = (() => {
  try {
    return require('sharp');
  } catch (e) {
    console.error('sharp is not available. Install sharp to run image optimization.');
    process.exit(1);
  }
})();

const argv = require('minimist')(process.argv.slice(2));
const thresholdKb = parseInt(argv.threshold || argv.t || '200', 10);
const dryRun = !!argv.dry;

const publicImagesDir = path.resolve(__dirname, '..', 'public', 'images');
const manifestPath = path.join(publicImagesDir, '_optimized.json');

function findFiles(dir, exts) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) {
      results.push(...findFiles(full, exts));
    } else if (it.isFile()) {
      const ext = path.extname(it.name).toLowerCase();
      if (exts.includes(ext)) results.push(full);
    }
  }
  return results;
}

function hasFfmpeg() {
  try {
    const r = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return r.status === 0 || r.status === null || r.status === undefined;
  } catch (e) {
    return false;
  }
}

const ffmpegAvailable = hasFfmpeg();
if (!ffmpegAvailable) console.warn('ffmpeg not found on PATH — GIF/video -> WebM conversion will be skipped.');

function ensureDirFor(filePath) {
  const d = path.dirname(filePath);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function rel(p) {
  return path.relative(publicImagesDir, p).replace(/\\\\/g, '/');
}

const extsImages = ['.png', '.jpg', '.jpeg'];
const extsGifs = ['.gif'];
const extsVideo = ['.mp4', '.mov', '.mkv', '.webm'];

const files = [
  ...findFiles(publicImagesDir, extsImages),
  ...findFiles(publicImagesDir, extsGifs),
  ...findFiles(publicImagesDir, extsVideo),
];

console.log(`Found ${files.length} candidate files in public/images`);

let manifest = {};
if (fs.existsSync(manifestPath)) {
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    console.warn('Failed to parse existing manifest; starting fresh.');
    manifest = {};
  }
}

const results = {};

for (const f of files) {
  const stat = fs.statSync(f);
  const sizeKb = Math.round(stat.size / 1024);
  if (sizeKb < thresholdKb) {
    // keep existing mapping if present
    if (manifest[rel(f)]) results[rel(f)] = manifest[rel(f)];
    continue;
  }

  const ext = path.extname(f).toLowerCase();
  const baseName = path.basename(f, ext);
  const dir = path.dirname(f);
  const relPath = rel(f);

  results[relPath] = results[relPath] || { original: relPath, variants: {} };

  if (extsImages.includes(ext)) {
    // generate avif and webp
    const avifOut = path.join(dir, `${baseName}.avif`);
    const webpOut = path.join(dir, `${baseName}.webp`);

    console.log(`Optimizing image ${relPath} (${sizeKb} KB) -> avif/webp`);
    if (!dryRun) {
      try {
        // AVIF
        sharp(f)
          .avif({ quality: 50 })
          .toFile(avifOut)
          .catch((e) => console.warn('avif write failed for', f, e));

        // WebP
        sharp(f)
          .webp({ quality: 75 })
          .toFile(webpOut)
          .catch((e) => console.warn('webp write failed for', f, e));
      } catch (e) {
        console.warn('sharp processing failed for', f, e);
      }
    }

    results[relPath].variants.avif = rel(avifOut);
    results[relPath].variants.webp = rel(webpOut);
  } else if (extsGifs.includes(ext)) {
    // convert GIF -> webm with ffmpeg if available
    console.log(`Processing GIF ${relPath} (${sizeKb} KB)`);
    const webmOut = path.join(dir, `${baseName}.webm`);
    if (ffmpegAvailable && !dryRun) {
      try {
        spawnSync('ffmpeg', ['-y', '-i', f, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '30', webmOut], { stdio: 'inherit' });
      } catch (e) {
        console.warn('ffmpeg conversion failed for', f, e);
      }
    }
    results[relPath].variants.webm = rel(webmOut);
  } else if (extsVideo.includes(ext)) {
    // convert video -> webm (VP9) for web delivery
    console.log(`Processing video ${relPath} (${sizeKb} KB)`);
    const webmOut = path.join(dir, `${baseName}.webm`);
    if (ffmpegAvailable && !dryRun) {
      try {
        spawnSync('ffmpeg', ['-y', '-i', f, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '30', webmOut], { stdio: 'inherit' });
      } catch (e) {
        console.warn('ffmpeg conversion failed for', f, e);
      }
    }
    results[relPath].variants.webm = rel(webmOut);
  }
}

// Merge with existing manifest keys we didn't process
for (const k of Object.keys(manifest || {})) {
  if (!results[k]) results[k] = manifest[k];
}

ensureDirFor(manifestPath);
if (!dryRun) {
  fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2), 'utf8');
  console.log('Wrote manifest to', manifestPath);
} else {
  console.log('Dry run - manifest not written.');
}

// Summary
const totalProcessed = Object.keys(results).length;
console.log(`Processed ${totalProcessed} entries. Threshold=${thresholdKb} KB, dryRun=${dryRun}`);

process.exit(0);
