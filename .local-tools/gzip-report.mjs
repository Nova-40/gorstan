import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const dir = path.join(process.cwd(), 'dist', 'assets');
if (!fs.existsSync(dir)) {
  console.error('dist/assets not found');
  process.exit(2);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
function gzSize(file) {
  const buf = fs.readFileSync(path.join(dir, file));
  return zlib.gzipSync(buf).length;
}

const stats = files.map(f => ({ name: f, gz: gzSize(f) })).sort((a,b)=>b.gz - a.gz);
const total = stats.reduce((s,x)=>s+x.gz,0);

const indexLike = stats.filter(s => /^index-[A-Za-z0-9]+\.js$/.test(s.name));
const bootstrapLike = stats.filter(s => /^(main|app|bootstrap)-[A-Za-z0-9]+\.js$/.test(s.name));
const initialSet = [...indexLike, ...bootstrapLike];
const initialGz = initialSet.reduce((s,x)=>s+x.gz,0);

const zones = ['controlnexus','glitchrealm','elfhame','mazezone','stantonharcourt'];
const perZone = {};
for (const z of zones) {
  const matched = stats.filter(s => new RegExp(z, 'i').test(s.name));
  perZone[z] = { total: matched.reduce((a,b)=>a+b.gz,0), files: matched.map(m=>m.name) };
}

console.log(JSON.stringify({ totalJsGz: total, top: stats.slice(0,15), initialGz, initialFiles: initialSet.map(s=>s.name), perZone }, null, 2));
