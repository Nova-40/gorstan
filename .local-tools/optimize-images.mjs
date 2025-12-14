#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
let sharp = null;
try {
  // optional dependency: if sharp isn't available (native build missing), fall back to no-op copies.
  // This keeps the manifest generation stable in CI/limited environments.
  // eslint-disable-next-line import/no-extraneous-dependencies
  sharp = (await import('sharp')).default;
} catch (e) {
  console.warn('sharp not available; optimizer will emit manifest entries but not true conversions. Install sharp to enable full optimization.');
}
import { execSync } from 'child_process';

const PUBLIC = path.resolve(process.cwd(), 'public', 'images');
const OUT_MANIFEST = path.resolve(process.cwd(), 'public', 'images', '_optimized.json');
const responsiveWidths = [480, 768, 1200, 1920];
const webpQuality = 82;
const avifQuality = 45;

function isImage(name) {
  return /\.(png|jpe?g|gif)$/i.test(name);
}

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

async function processRaster(filePath, relPath, outDir) {
  const ext = path.extname(relPath).toLowerCase();
  const base = path.basename(relPath, ext);
  const out = { original: relPath, variants: [] };
  const img = sharp ? sharp(filePath, { animated: ext === '.gif' }) : null;
  const meta = img ? await img.metadata() : { width: null };

  for (const w of responsiveWidths) {
    if (meta.width && meta.width < w) continue; // skip sizes larger than original
    const outWebP = path.join(outDir, `${base}-${w}.webp`);
    const outAvif = path.join(outDir, `${base}-${w}.avif`);
    if (img) {
      await img.resize({ width: w }).toFormat('webp', { quality: webpQuality }).toFile(outWebP);
      await img.resize({ width: w }).toFormat('avif', { quality: avifQuality }).toFile(outAvif);
    } else {
      // fallback: copy original as a placeholder so components can reference a file
      fs.copyFileSync(filePath, outWebP);
      fs.copyFileSync(filePath, outAvif);
    }
    out.variants.push({ width: w, webp: path.relative(PUBLIC, outWebP).replace(/\\/g, '/'), avif: path.relative(PUBLIC, outAvif).replace(/\\/g, '/') });
  }

  // also create a fallback webp/avif at original size
  const outWebP0 = path.join(outDir, `${base}.webp`);
  const outAvif0 = path.join(outDir, `${base}.avif`);
  if (img) {
    await img.toFormat('webp', { quality: webpQuality }).toFile(outWebP0);
    await img.toFormat('avif', { quality: avifQuality }).toFile(outAvif0);
  } else {
    fs.copyFileSync(filePath, outWebP0);
    fs.copyFileSync(filePath, outAvif0);
  }
  out.variants.unshift({ width: meta.width || null, webp: path.relative(PUBLIC, outWebP0).replace(/\\/g, '/'), avif: path.relative(PUBLIC, outAvif0).replace(/\\/g, '/') });

  return out;
}

async function processGif(filePath, relPath, outDir) {
  // use ffmpeg (assumed to be installed) to convert gif -> mp4/webm and extract poster
  const ext = path.extname(relPath).toLowerCase();
  const base = path.basename(relPath, ext);
  const out = { original: relPath, variants: [] };
  const mp4 = path.join(outDir, `${base}.mp4`);
  const webm = path.join(outDir, `${base}.webm`);
  const poster = path.join(outDir, `${base}-poster.jpg`);

  try {
    if (process.env.SKIP_FFMPEG || !fs.existsSync('/usr/bin/ffmpeg') && !fs.existsSync('C:/Program Files/ffmpeg/bin/ffmpeg.exe')) {
      // no ffmpeg found on PATH: create placeholders by copying original and generating a poster via sharp if available
      const posterPath = path.join(outDir, `${base}-poster.jpg`);
      if (sharp) {
        await sharp(filePath, { animated: true }).extractFrame(0).toFile(posterPath);
      } else if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, posterPath);
      }
      fs.copyFileSync(filePath, mp4);
      fs.copyFileSync(filePath, webm);
      out.variants.push({ mp4: path.relative(PUBLIC, mp4).replace(/\\/g, '/'), webm: path.relative(PUBLIC, webm).replace(/\\/g, '/'), poster: path.relative(PUBLIC, poster).replace(/\\/g, '/') });
    } else {
      execSync(`ffmpeg -y -i "${filePath}" -movflags faststart -pix_fmt yuv420p -c:v libx264 -crf 28 -preset veryfast "${mp4}"`);
      execSync(`ffmpeg -y -i "${filePath}" -c:v libvpx-vp9 -crf 34 -b:v 0 "${webm}"`);
      execSync(`ffmpeg -y -i "${filePath}" -vframes 1 -q:v 2 "${poster}"`);
      out.variants.push({ mp4: path.relative(PUBLIC, mp4).replace(/\\/g, '/'), webm: path.relative(PUBLIC, webm).replace(/\\/g, '/'), poster: path.relative(PUBLIC, poster).replace(/\\/g, '/') });
    }
  } catch (e) {
    console.error('ffmpeg failed for', filePath, e && e.message ? e.message : e);
  }

  return out;
}

async function main() {
  if (!fs.existsSync(PUBLIC)) { console.error('No public/images folder found'); process.exit(1); }
  const manifest = fs.existsSync(OUT_MANIFEST) ? JSON.parse(fs.readFileSync(OUT_MANIFEST, 'utf8')) : {};

  const files = [];
  const walk = (dir, rel = '') => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const r = path.join(rel, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full, r);
      else if (isImage(name) && st.size > 200 * 1024) files.push({ full, rel: r, size: st.size });
    }
  };
  walk(PUBLIC);

  console.log('Found', files.length, 'large images to optimize');

  for (const f of files) {
    const outDir = path.join(PUBLIC, 'variants', path.dirname(f.rel));
    ensureDir(outDir);
    if (f.rel.toLowerCase().endsWith('.gif')) {
      if (f.size < 1024 * 1024) { console.log('Skipping small gif', f.rel); continue; }
      const info = await processGif(f.full, f.rel, outDir);
      manifest[f.rel] = info;
      console.log('Processed GIF', f.rel);
    } else {
      const info = await processRaster(f.full, f.rel, outDir);
      manifest[f.rel] = info;
      console.log('Processed raster', f.rel, 'variants:', info.variants.length);
    }
  }

  fs.writeFileSync(OUT_MANIFEST, JSON.stringify(manifest, null, 2));
  console.log('Wrote manifest to', OUT_MANIFEST);
}

main().catch(e => { console.error(e); process.exit(1);
});
