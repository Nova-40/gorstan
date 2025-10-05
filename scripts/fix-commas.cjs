const fs = require('fs').promises;
const path = require('path');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) await walk(full);
    else if (ent.isFile() && full.endsWith('.ts')) await fixFile(full);
  }
}

async function fixFile(filePath) {
  let s = await fs.readFile(filePath, 'utf8');
  const orig = s;
  // Replace instances of '],,' with '],'
  s = s.replace(/\],,/g, '],');
  // Also fix trailing ',,' after strings: "",, -> ",
  s = s.replace(/"\s*,\s*,/g, '",');
  if (s !== orig) {
    await fs.writeFile(filePath + '.bak2', orig, 'utf8');
    await fs.writeFile(filePath, s, 'utf8');
    console.log('Fixed commas in', path.relative(process.cwd(), filePath));
  }
}

(async () => {
  const roomsDir = path.join(__dirname, '..', 'src', 'rooms');
  console.log('Running comma fixer on', roomsDir);
  await walk(roomsDir);
  console.log('Done');
})();
