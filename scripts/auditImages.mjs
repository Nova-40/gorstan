
import fs from 'node:fs';
import path from 'node:path';
const root = path.join(process.cwd());
const rooms = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'rooms.json'), 'utf-8'));
const reg = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'roomImages.json'), 'utf-8'));
const publicDir = path.join(root, 'public');
const errors = [];
const warnings = [];

function fileExists(webPath){
  if (!webPath) return false;
  const rel = webPath.startsWith('/') ? webPath.slice(1) : webPath;
  const full = path.join(publicDir, rel);
  return fs.existsSync(full);
}

for (const [id, room] of Object.entries(rooms)){
  const specific = reg.images[id];
  const zoneDefault = reg._zoneDefaults[room.zone] || reg._zoneDefaults['default'];
  const imgPath = specific || zoneDefault;
  if (!imgPath){
    warnings.push(`Room ${id} has no image mapping and no zone default; UI will show fallback panel.`);
  } else if (!fileExists(imgPath)) {
    warnings.push(`Image path not found on disk: ${imgPath} (room ${id})`);
  }
}

if (warnings.length){
  console.warn('Image audit warnings:\n' + warnings.join('\n'));
}
console.log('Image audit completed with', warnings.length, 'warnings.');
process.exit(0);
