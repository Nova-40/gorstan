#!/usr/bin/env node
/* CommonJS image optimizer for projects with "type": "module" */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
// fluent-ffmpeg + static ffmpeg
let ffmpeg;
let ffmpegStaticPath = null;
try {
  ffmpeg = require('fluent-ffmpeg');
  ffmpegStaticPath = require('ffmpeg-static');
  if (ffmpeg && ffmpegStaticPath) {
    ffmpeg.setFfmpegPath(ffmpegStaticPath);
  }
} catch (e) {
  // optional
  ffmpeg = null;
  ffmpegStaticPath = null;
}

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('sharp is not available; image transcode steps will be skipped. Install sharp to enable AVIF/WebP generation.');
  sharp = null;
}

function parseArgs(argv) {
  const out = {};
  for (const a of argv) {
    if (a === '--dry') out.dry = true;
    else if (a.startsWith('--threshold=')) out.threshold = a.split('=')[1];
    else if (a === '-t') {
      // next arg
    }
    else if (a.startsWith('-t')) out.threshold = a.slice(2);
  }
  return out;
}

const argv = parseArgs(process.argv.slice(2));
const thresholdKb = parseInt(argv.threshold || '200', 10);
const dryRun = !!argv.dry;

const publicImagesDir = path.resolve(__dirname, '..', 'public', 'images');
const OUT_DIR = path.join(publicImagesDir, 'optimized');
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

function relOut(p) {
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
    if (manifest[rel(f)]) results[rel(f)] = manifest[rel(f)];
    continue;
  }

  const ext = path.extname(f).toLowerCase();
  const baseName = path.basename(f, ext);
  const dir = path.dirname(f);
  const relPath = rel(f);

  results[relPath] = results[relPath] || { original: relPath, variants: {} };

    if (extsImages.includes(ext)) {
    // Outputs go into OUT_DIR preserving subpaths
    const relOrig = path.relative(publicImagesDir, f).replace(/\\\\/g, '/');
    const outBaseDir = path.join(OUT_DIR, path.dirname(relOrig));
    ensureDirFor(path.join(outBaseDir, 'x'));
    const avifOut = path.join(outBaseDir, `${baseName}.avif`);
    const webpOut = path.join(outBaseDir, `${baseName}.webp`);

    console.log(`Optimizing image ${relPath} (${sizeKb} KB) -> avif/webp in optimized/${path.dirname(relOrig)}`);
    if (sharp && !dryRun) {
      try {
        sharp(f).avif({ quality: 50 }).toFile(avifOut).catch((e) => console.warn('avif write failed for', f, e));
        sharp(f).webp({ quality: 75 }).toFile(webpOut).catch((e) => console.warn('webp write failed for', f, e));
      } catch (e) {
        console.warn('sharp processing failed for', f, e);
      }
      // record relative to public/images
      results[relPath].avif = relOut(avifOut);
      results[relPath].webp = relOut(webpOut);
      try { results[relPath].sizes = results[relPath].sizes || {}; results[relPath].sizes.avif = fs.statSync(avifOut).size; } catch(e){}
      try { results[relPath].sizes = results[relPath].sizes || {}; results[relPath].sizes.webp = fs.statSync(webpOut).size; } catch(e){}
    } else {
      // sharp not available — leave variants empty but record intent
      results[relPath].avif = null;
      results[relPath].webp = null;
    }
  } else if (extsGifs.includes(ext)) {
    console.log(`Processing GIF ${relPath} (${sizeKb} KB)`);
    const relOrig = path.relative(publicImagesDir, f).replace(/\\\\/g, '/');
    const outBaseDir = path.join(OUT_DIR, path.dirname(relOrig));
    ensureDirFor(path.join(outBaseDir, 'x'));
    const webmOut = path.join(outBaseDir, `${baseName}.webm`);
    if (ffmpegAvailable && !dryRun) {
      try {
        const cmd = ffmpegStaticPath || 'ffmpeg';
        spawnSync(cmd, ['-y', '-i', f, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '30', webmOut], { stdio: 'inherit' });
        results[relPath].webm = relOut(webmOut);
        try { results[relPath].sizes = results[relPath].sizes || {}; results[relPath].sizes.webm = fs.statSync(webmOut).size; } catch(e){}
      } catch (e) {
        console.warn('ffmpeg conversion failed for', f, e);
        results[relPath].webm = null;
      }
    } else {
      results[relPath].webm = null;
    }
  } else if (extsVideo.includes(ext)) {
    console.log(`Processing video ${relPath} (${sizeKb} KB)`);
    const relOrig = path.relative(publicImagesDir, f).replace(/\\\\/g, '/');
    const outBaseDir = path.join(OUT_DIR, path.dirname(relOrig));
    ensureDirFor(path.join(outBaseDir, 'x'));
    const webmOut = path.join(outBaseDir, `${baseName}.webm`);
    const mp4Out = path.join(outBaseDir, `${baseName}.mp4`);
    if (ffmpegAvailable && !dryRun) {
      try {
        const cmd = ffmpegStaticPath || 'ffmpeg';
        // WebM (VP9)
        spawnSync(cmd, ['-y', '-i', f, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '30', webmOut], { stdio: 'inherit' });
        results[relPath].webm = relOut(webmOut);
        try { results[relPath].sizes = results[relPath].sizes || {}; results[relPath].sizes.webm = fs.statSync(webmOut).size; } catch(e){}
        // MP4 fallback (H.264)
        spawnSync(cmd, ['-y', '-i', f, '-c:v', 'libx264', '-crf', '23', mp4Out], { stdio: 'inherit' });
        results[relPath].mp4 = relOut(mp4Out);
        try { results[relPath].sizes = results[relPath].sizes || {}; results[relPath].sizes.mp4 = fs.statSync(mp4Out).size; } catch(e){}
      } catch (e) {
        console.warn('ffmpeg conversion failed for', f, e);
        results[relPath].webm = null;
        results[relPath].mp4 = null;
      }
    } else {
      results[relPath].webm = null;
      results[relPath].mp4 = null;
    }
  }
}

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

const totalProcessed = Object.keys(results).length;
console.log(`Processed ${totalProcessed} entries. Threshold=${thresholdKb} KB, dryRun=${dryRun}`);

process.exit(0);
