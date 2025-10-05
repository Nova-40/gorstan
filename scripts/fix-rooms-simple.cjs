const fs = require('fs');
const path = require('path');

const roomsDir = path.join(__dirname, '..', 'src', 'rooms');

function fixFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');

  // 1) Ensure description is an array: description: '...' => description: ['...']
  src = src.replace(/description:\s*(['`"])((?:.|\n)*?)\1,\s*\n/, (m, q, text) => {
    // preserve indentation
    return `description: [${q}${text.replace(/\n/g, '\\n')}${q}],\n`;
  });

  // 2) Convert items: ['a','b'] -> [{ id: 'a' }, { id: 'b' }]
  src = src.replace(/items:\s*\[([\s\S]*?)\]\s*,/gm, (m, inner) => {
    // if inner contains object braces, skip
    if (/\{/.test(inner)) return m;
    const elems = inner
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        return `{ id: ${s} }`;
      });
    return `items: [\n    ${elems.join(',\n    ')}\n  ],`;
  });

  // 3) Convert interactables: [ {...}, {...} ] -> { id1: {...}, id2: {...} }
  src = src.replace(/interactables:\s*\[([\s\S]*?)\]\s*,/gm, (m, inner) => {
    const parts = inner
      .split(/\},\s*\{/) // rough split between objects
      .map((p, idx) => {
        let piece = p;
        if (idx === 0 && piece.trim().startsWith('{')) piece = piece.trim().slice(1);
        if (idx === parts.length - 1 && piece.trim().endsWith('}')) piece = piece.trim().slice(0, -1);
        // try find id: 'xyz' inside piece
        const idMatch = piece.match(/id\s*:\s*['"]([^'\"]+)['"]/);
        const id = idMatch ? idMatch[1] : `item_${idx}`;
        const objText = `{ ${piece.trim().replace(/\n\s*/g, ' ') } }`;
        return `'${id}': ${objText}`;
      });

    return `interactables: {\n    ${parts.join(',\n    ')}\n  },`;
  });

  fs.writeFileSync(filePath, src, 'utf8');
}

function fixAll() {
  const files = fs.readdirSync(roomsDir).filter((f) => f.endsWith('.ts'));
  files.forEach((f) => {
    try {
      fixFile(path.join(roomsDir, f));
      console.log('Fixed', f);
    } catch (e) {
      console.error('Error fixing', f, e.message);
    }
  });
}

fixAll();
