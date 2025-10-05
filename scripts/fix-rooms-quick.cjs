const fs = require('fs').promises;
const path = require('path');

function humanizeId(id) {
  return id
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

async function processFile(filePath) {
  let src = await fs.readFile(filePath, 'utf8');
  let changed = false;

  // 1) Convert description: '...' (not arrays) into description: ["..."]
  src = src.replace(/(description:\s*)(?!\[)(['`"])([\s\S]*?)\2(,?\s*\n)/g, (m, pre, q, inner, tail) => {
    changed = true;
    // Preserve indentation from pre
    const indentMatch = m.match(/(^|\n)(\s*)description:/);
    const indent = indentMatch ? indentMatch[2] : '';
    const lines = inner.split(/\r?\n/).map(s => s.replace(/\\n/g, '\\n'));
    const content = lines.join('\n');
    return `${pre}[\n${indent}  ${q}${content}${q},\n${indent}],${tail}`;
  });

  // 2) In items arrays, convert { id: 'x' } -> { id: 'x', name: 'X' }
  src = src.replace(/\{\s*id\s*:\s*(['`"])([\w\- ]+)\1\s*\}/g, (m, q, id) => {
    changed = true;
    return `{ id: ${q}${id}${q}, name: ${q}${humanizeId(id)}${q} }`;
  });

  // 3) Convert string items in arrays into objects: 'foo' -> { id: 'foo', name: 'Foo' }
  // Only within items arrays - naive but works for common patterns
  src = src.replace(/items:\s*\[([\s\S]*?)\]/g, (m, inner) => {
    let modified = inner.replace(/(^|,)(\s*)(['`"])([\w\- ]+)\3(\s*)(?=,|$)/g, (m2, pre, sp, q, id, post) => {
      changed = true;
      return `${pre}${sp}{ id: ${q}${id}${q}, name: ${q}${humanizeId(id)}${q} }${post}`;
    });
    return `items: [${modified}]`;
  });

  if (changed) {
    await fs.writeFile(filePath + '.bak', src, 'utf8');
    await fs.writeFile(filePath, src, 'utf8');
    console.log('Fixed:', path.relative(process.cwd(), filePath));
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      await walk(full);
    } else if (ent.isFile() && full.endsWith('.ts')) {
      await processFile(full);
    }
  }
}

(async () => {
  const roomsDir = path.join(__dirname, '..', 'src', 'rooms');
  console.log('Running quick fixer on', roomsDir);
  await walk(roomsDir);
  console.log('Done.');
})();
