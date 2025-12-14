const fs = require('fs');
const path = require('path');

const roomsDir = path.join(__dirname, '..', 'src', 'rooms');

function fixFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');

  // 1) Rename Roomitem -> items
  src = src.replace(/\bRoomitem\s*:/g, 'items:');

  // 2) If description is a string, make it an array
  src = src.replace(/description:\s*(['\"])((?:.|\n)*?)\1\s*,/g, (m, q, inner) => {
    return `description: [${q}${inner.replace(/\n/g, '\\n')}${q}],`;
  });

  // 3) Convert item.description arrays to string by joining elements
  // Match items: [ { id: 'x', description: [ 'a', 'b' ] } , ... ]
  src = src.replace(/description:\s*\[([^\]]+)\]/g, (m, inner) => {
    // if inner contains string literals separated by commas, join them
    const strings = inner.match(/(['\"])(.*?)\1/g);
    if (strings && strings.length > 0) {
      const joined = strings.map(s => s.replace(/^['\"]|['\"]$/g, '')).join(' ');
      return `description: ${JSON.stringify(joined)}`;
    }
    return m;
  });

  // 4) Ensure interactables exists and is an object
  if (!/interactables\s*:/.test(src)) {
    // insert interactables: {} before closing of object (before '};' at end)
    src = src.replace(/\n\s*};\s*\n\s*export default/, `\n  interactables: {},\n};\n\nexport default`);
  }

  // 5) Convert interactables arrays to object (rough conversion)
  src = src.replace(/interactables:\s*\[([\s\S]*?)\]\s*,/gm, (m, inner) => {
    const parts = inner.split(/\},\s*\{/).map((p, idx) => {
      let piece = p;
      if (idx === 0) piece = piece.replace(/^\s*\{/, '');
      if (idx === parts.length - 1) piece = piece.replace(/\}\s*$/, '');
      const idMatch = piece.match(/id\s*:\s*['\"]([^'\"]+)['\"]/);
      const id = idMatch ? idMatch[1] : `item_${idx}`;
      return `'${id}': { ${piece.trim()} }`;
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
