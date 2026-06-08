#!/usr/bin/env node
/*
  Generates compact SVG sprites for every canonical and room-local item.

  The output is intentionally simple and symbolic: transparent SVG assets that
  can sit on top of room art without fighting the background illustration.
*/
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public', 'sprites', 'items');
const registryFile = path.join(root, 'src', 'roomRegistry.ts');
const canonicalItemsFile = path.join(root, 'src', 'engine', 'items.ts');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function slugForItemId(itemId) {
  return itemId
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function propName(node) {
  if (!node) return '';
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return '';
}

function objectProp(objectNode, key) {
  if (!objectNode || !ts.isObjectLiteralExpression(objectNode)) return null;
  for (const property of objectNode.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    if (propName(property.name) === key) return property.initializer;
  }
  return null;
}

function stringValue(node) {
  if (!node) return '';
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text.trim();
  return '';
}

function roomFiles() {
  const source = fs.readFileSync(registryFile, 'utf8');
  return [...source.matchAll(/import\s+\w+\s+from\s+['"]\.\/rooms\/([^'"]+)['"]/g)]
    .map((match) => path.join(root, 'src', 'rooms', `${match[1]}.ts`))
    .filter((file) => fs.existsSync(file));
}

function collectRoomItems(file, items) {
  const source = fs.readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isObjectLiteralExpression(node.initializer)) {
      const itemsNode = objectProp(node.initializer, 'items');
      if (itemsNode && ts.isArrayLiteralExpression(itemsNode)) {
        for (const element of itemsNode.elements) {
          if (ts.isObjectLiteralExpression(element)) {
            const id = stringValue(objectProp(element, 'id'));
            const name = stringValue(objectProp(element, 'name')) || id;
            if (id) items.set(id, { id, name });
          } else if (ts.isStringLiteral(element)) {
            items.set(element.text, { id: element.text, name: element.text });
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

function collectCanonicalItems(items) {
  const source = fs.readFileSync(canonicalItemsFile, 'utf8');
  const sourceFile = ts.createSourceFile(canonicalItemsFile, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  function visit(node) {
    if (ts.isArrayLiteralExpression(node)) {
      for (const element of node.elements) {
        if (!ts.isObjectLiteralExpression(element)) continue;
        const id = stringValue(objectProp(element, 'id'));
        const name = stringValue(objectProp(element, 'name')) || id;
        if (id) items.set(id, { id, name });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

function hash(input) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function paletteFor(item) {
  const h = hash(`${item.id}:${item.name}`);
  const hue = h % 360;
  return {
    hue,
    primary: `hsl(${hue} 58% 54%)`,
    secondary: `hsl(${(hue + 42) % 360} 64% 70%)`,
    dark: `hsl(${hue} 45% 24%)`,
    light: `hsl(${hue} 80% 88%)`,
    glow: `hsl(${(hue + 180) % 360} 70% 78%)`,
  };
}

function kindFor(item) {
  const text = `${item.id} ${item.name}`.toLowerCase();
  if (/scroll|map|manual|log|register|newspaper|note|page|file|document|constitution|lore/.test(text)) return 'paper';
  if (/key|badge|token|coin|medallion|card|insignia|fragment|shard|crystal|rune|gem/.test(text)) return 'artifact';
  if (/coffee|tea|stew|bread|meat|ale|water|poultice|herb|flower|sand/.test(text)) return 'organic';
  if (/device|scanner|console|core|stabilizer|compass|lens|beacon|tool|kit|flashlight|pen/.test(text)) return 'tech';
  if (/bag|briefcase|boot|towel|sock|bed|chain|branch|wing|toy|banner/.test(text)) return 'object';
  return 'artifact';
}

function svgFor(item) {
  const palette = paletteFor(item);
  const kind = kindFor(item);
  const id = slugForItemId(item.id);
  const seed = hash(item.id);
  const sparkleX = 28 + (seed % 42);
  const sparkleY = 16 + ((seed >> 5) % 38);

  const commonDefs = `
  <defs>
    <radialGradient id="glow-${id}" cx="50%" cy="48%" r="55%">
      <stop offset="0" stop-color="${palette.light}" stop-opacity=".95"/>
      <stop offset=".68" stop-color="${palette.secondary}" stop-opacity=".72"/>
      <stop offset="1" stop-color="${palette.primary}" stop-opacity=".08"/>
    </radialGradient>
    <linearGradient id="main-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.light}"/>
      <stop offset=".52" stop-color="${palette.primary}"/>
      <stop offset="1" stop-color="${palette.dark}"/>
    </linearGradient>
  </defs>`;

  const sparkle = `
  <path d="M${sparkleX} ${sparkleY - 8}l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="${palette.glow}" opacity=".88"/>
  <circle cx="${74 - (seed % 18)}" cy="${22 + ((seed >> 3) % 16)}" r="3" fill="#fff8d6" opacity=".75"/>`;

  const variants = {
    paper: `
  <path d="M24 10h34l14 14v50H24z" fill="url(#main-${id})" stroke="${palette.dark}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M58 10v15h14" fill="${palette.secondary}" stroke="${palette.dark}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M34 34h26M34 45h31M34 56h23" stroke="${palette.dark}" stroke-width="4" stroke-linecap="round" opacity=".72"/>
  <path d="M27 13h28" stroke="#fff" stroke-width="3" opacity=".45"/>`,
    artifact: `
  <path d="M48 8l25 16v30L48 78 23 54V24z" fill="url(#glow-${id})" stroke="${palette.dark}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M48 18l14 10v19L48 63 34 47V28z" fill="url(#main-${id})" stroke="#fff" stroke-width="2" opacity=".9"/>
  <path d="M48 18v45M34 28l28 19M62 28L34 47" stroke="${palette.dark}" stroke-width="2" opacity=".35"/>`,
    organic: `
  <ellipse cx="48" cy="54" rx="27" ry="18" fill="url(#main-${id})" stroke="${palette.dark}" stroke-width="5"/>
  <path d="M42 38c-9-14 5-25 17-21 3 12-5 20-17 21z" fill="${palette.secondary}" stroke="${palette.dark}" stroke-width="4"/>
  <path d="M30 57c10 7 25 9 38 0" fill="none" stroke="#fff" stroke-width="3" opacity=".42" stroke-linecap="round"/>`,
    tech: `
  <rect x="21" y="18" width="54" height="48" rx="10" fill="url(#main-${id})" stroke="${palette.dark}" stroke-width="5"/>
  <rect x="31" y="27" width="34" height="19" rx="4" fill="${palette.dark}" opacity=".72"/>
  <path d="M35 55h8M49 55h12M25 16l-7-7M71 16l7-7M25 68l-7 7M71 68l7 7" stroke="${palette.dark}" stroke-width="4" stroke-linecap="round"/>
  <path d="M36 36h22" stroke="${palette.glow}" stroke-width="4" stroke-linecap="round"/>`,
    object: `
  <path d="M23 29c0-10 8-18 18-18h14c10 0 18 8 18 18v28c0 10-8 18-18 18H41c-10 0-18-8-18-18z" fill="url(#main-${id})" stroke="${palette.dark}" stroke-width="5"/>
  <path d="M35 14c3-7 23-7 26 0" fill="none" stroke="${palette.dark}" stroke-width="5" stroke-linecap="round"/>
  <path d="M33 36h30M33 49h30" stroke="#fff" stroke-width="4" opacity=".4" stroke-linecap="round"/>`,
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" role="img" aria-label="${escapeXml(item.name)}">
${commonDefs}
  <ellipse cx="48" cy="82" rx="28" ry="7" fill="#000" opacity=".18"/>
${variants[kind]}
${sparkle}
</svg>
`;
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function main() {
  ensureDir(outDir);

  const items = new Map();
  for (const file of roomFiles()) collectRoomItems(file, items);
  collectCanonicalItems(items);

  let created = 0;
  let skipped = 0;
  const manifest = [];

  for (const item of [...items.values()].sort((a, b) => a.id.localeCompare(b.id))) {
    const fileName = `${slugForItemId(item.id)}.svg`;
    const file = path.join(outDir, fileName);
    manifest.push({ id: item.id, name: item.name, sprite: `/sprites/items/${fileName}` });

    if (fs.existsSync(file)) {
      skipped += 1;
      continue;
    }

    fs.writeFileSync(file, svgFor(item), 'utf8');
    created += 1;
  }

  fs.writeFileSync(
    path.join(outDir, '_manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  console.log(`Item sprites: ${manifest.length}`);
  console.log(`Created: ${created}`);
  console.log(`Existing kept: ${skipped}`);
  console.log(`Manifest: ${path.relative(root, path.join(outDir, '_manifest.json'))}`);
}

main();
