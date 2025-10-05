import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function gzipSizeSync(buffer) { return zlib.gzipSync(buffer).length; }

const nm = path.resolve(process.cwd(), 'node_modules');
if (!fs.existsSync(nm)) {
  console.error('node_modules not found');
  process.exit(1);
}

function dirSize(dir) {
  let total = 0;
  const walk = (d) => {
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name);
      try {
        const s = fs.statSync(p);
        if (s.isDirectory()) walk(p);
        else total += s.size;
      } catch (e) {}
    }
  };
  try { walk(dir); } catch (e) {}
  return total;
}

const entries = [];
for (const name of fs.readdirSync(nm)) {
  const full = path.join(nm, name);
  try {
    if (!fs.statSync(full).isDirectory()) continue;
    const size = dirSize(full);
    // approximate gz by gzipping the package.json if present
    let gz = 0;
    const pj = path.join(full, 'package.json');
    if (fs.existsSync(pj)) gz = gzipSizeSync(fs.readFileSync(pj));
    entries.push({ name, path: full, raw: size, gz });
  } catch (e) {}
}
entries.sort((a,b) => b.raw - a.raw);
const top = entries.slice(0, 20);
console.log(JSON.stringify(top, null, 2));
