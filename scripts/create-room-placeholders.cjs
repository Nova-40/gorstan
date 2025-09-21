const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const roomsSrc = path.join(repoRoot, 'src', 'rooms');
const roomsPublic = path.join(repoRoot, 'public', 'images', 'rooms');
const placeholder = path.join(roomsPublic, 'placeholder-room.png');

if (!fs.existsSync(placeholder)) {
  console.error('Placeholder image not found at', placeholder);
  process.exit(1);
}

const roomFiles = fs.readdirSync(roomsSrc).filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'));
const referenced = new Set();

const imageRegex = /image:\s*['"]([^'\"]+)['"]/g;

for (const file of roomFiles) {
  const full = path.join(roomsSrc, file);
  const content = fs.readFileSync(full, 'utf8');
  let m;
  while ((m = imageRegex.exec(content))) {
    referenced.add(m[1]);
  }
}

const existing = new Set(fs.readdirSync(roomsPublic));
const missing = [...referenced].filter((name) => !existing.has(name));

console.log(`Found ${referenced.size} referenced room images, ${existing.size} existing files, ${missing.length} missing.`);

for (const m of missing) {
  const dest = path.join(roomsPublic, m);
  try {
    fs.copyFileSync(placeholder, dest);
    console.log('Created placeholder:', m);
  } catch (e) {
    console.error('Failed to create placeholder for', m, e.message);
  }
}

console.log('Done.');
