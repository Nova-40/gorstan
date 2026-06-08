#!/usr/bin/env node
/*
  Generates a room art manifest from the TypeScript room modules.

  The manifest is production planning data: every room gets a final art prompt,
  target asset path, and asset/config status. It deliberately does not overwrite
  room images. Image generation/replacement should be a conscious per-room step.
*/
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const roomsDir = path.join(root, 'src', 'rooms');
const rootRegistryFile = path.join(root, 'src', 'roomRegistry.ts');
const publicRoomsDir = path.join(root, 'public', 'images', 'rooms');
const outFile = path.join(root, 'docs', 'room-art-manifest.generated.md');

const STYLE =
  'modernised retro point-and-click adventure game background, painterly with slight pixel-art inspiration, polished readable silhouettes, atmospheric lighting, no UI labels, no text baked into the artwork, no watermark';

const ZONE_STYLE = {
  introZone: 'cool sci-fi lighting, dormant but powerful systems, cinematic terminal-era mystery',
  londonZone: 'grounded London textures, warm human details, subtle uncanny dimensional leakage',
  gorstanZone: 'Scottish Highland atmosphere, old stone, weather, mythic rural strangeness',
  elfhameZone: 'enchanted fae woodland and palace materials, luminous mist, beautiful but unsafe',
  glitchZone: 'digital rupture, corrupted geometry, warning light, unstable reality artifacts',
  latticeZone: 'geometric luminous architecture, libraries and observatories fused with dimensional structure',
  mazeZone: 'stone labyrinth logic, repetition with one readable clue, moody torch or ambient light',
  multiZone: 'liminal transit space, threshold architecture, multiple realities implied at once',
  newyorkZone: 'New York urban realism mixed with interdimensional infrastructure and neon grime',
  offgorstanZone: 'ancient off-world institutional mystery, stone, crystal, archives, solemn impossible tech',
  offmultiverseZone: 'fractured cosmic space, broken reality shards, unstable horizons',
  stantonZone: 'English village history distorted by magical or dimensional states',
};

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return full.endsWith('.ts') && !entry.name.endsWith('.d.ts') ? [full] : [];
  });
}

function registryRoomFiles() {
  if (!fs.existsSync(rootRegistryFile)) return [];

  const registrySource = fs.readFileSync(rootRegistryFile, 'utf8');
  return [...registrySource.matchAll(/import\s+\w+\s+from\s+['"]\.\/rooms\/([^'"]+)['"]/g)]
    .map((match) => path.join(roomsDir, `${match[1]}.ts`))
    .filter((file) => fs.existsSync(file));
}

function getString(source, key) {
  const match = source.match(new RegExp(`${key}:\\s*(['"\`])([\\s\\S]*?)\\1`));
  return match ? match[2].trim() : '';
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

function stringArrayValue(node) {
  if (!node) return [];
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(stringValue).filter(Boolean);
  }
  const single = stringValue(node);
  return single ? [single] : [];
}

function findRoomObject(source, file) {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const candidates = [];

  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isObjectLiteralExpression(node.initializer)) {
      const objectNode = node.initializer;
      const score = ['id', 'title', 'description', 'image', 'exits'].filter((key) => objectProp(objectNode, key)).length;
      if (score >= 3) candidates.push({ objectNode, score });
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.objectNode ?? null;
}

function getRoomString(roomObject, source, key) {
  return stringValue(objectProp(roomObject, key)) || getString(source, key);
}

function getDescription(roomObject, source) {
  const description = stringArrayValue(objectProp(roomObject, 'description'))
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(' ');
  if (description) return description;

  return getString(source, 'description').replace(/\s+/g, ' ').trim();
}

function getItems(roomObject, source) {
  const itemsNode = objectProp(roomObject, 'items');
  if (itemsNode && ts.isArrayLiteralExpression(itemsNode)) {
    return itemsNode.elements
      .map((element) => (ts.isObjectLiteralExpression(element) ? stringValue(objectProp(element, 'name')) : ''))
      .map((name) => name.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  const itemsMatch = source.match(/items:\s*\[([\s\S]*?)\]\s*,/);
  if (!itemsMatch) return [];

  return [...itemsMatch[1].matchAll(/name:\s*(['"`])([\s\S]*?)\1/g)]
    .map((match) => match[2].replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 8);
}

function zoneFromFile(file, roomObject, source) {
  const explicit = getRoomString(roomObject, source, 'zone');
  if (explicit) return explicit;
  const name = path.basename(file);
  const zoneMatch = name.match(/^([a-z]+Zone)_/i);
  return zoneMatch ? zoneMatch[1] : 'multiZone';
}

function imagePathFor(image) {
  if (!image) return '';
  if (image.startsWith('/')) return image;
  if (image.includes('/')) return `/images/${image}`;
  return `/images/rooms/${image}`;
}

function assetExists(image) {
  if (!image) return false;
  const imageFile = image.startsWith('/') ? image.replace(/^\/images\/rooms\//, '') : path.basename(image);
  return fs.existsSync(path.join(publicRoomsDir, imageFile));
}

function promptFor(room) {
  const items = room.items.length ? `Visible optional props: ${room.items.join(', ')}.` : '';
  const zoneStyle = ZONE_STYLE[room.zone] ?? 'Gorstan multiverse atmosphere, readable adventure-game staging';
  return [
    `Create a 16:9 room background for Gorstan.`,
    `Room: ${room.title} (${room.id}).`,
    `Scene: ${room.description}`,
    items,
    `Art direction: ${STYLE}.`,
    `Zone treatment: ${zoneStyle}.`,
    `Composition: front-facing or three-quarter room view, strong depth, clear exits and interactable silhouettes, leave space for optional sprite and hotspot overlays.`,
    `Avoid: embedded readable UI text, logos, captions, watermarks, over-dark crops, photoreal stock-photo look, objects that contradict the room description.`,
  ]
    .filter(Boolean)
    .join(' ');
}

function roomSortKey(room) {
  return `${room.zone}/${room.id}`;
}

function readRooms() {
  const sourceFiles = registryRoomFiles();
  const files = sourceFiles.length ? sourceFiles : walk(roomsDir);

  return files
    .filter((file) => !file.endsWith('Room.ts') && !file.endsWith('RoomObjectives.ts') && !file.endsWith('roomRegistry.ts'))
    .map((file) => {
      const source = fs.readFileSync(file, 'utf8');
      const roomObject = findRoomObject(source, file);
      const id = getRoomString(roomObject, source, 'id');
      if (!id) return null;

      const image = getRoomString(roomObject, source, 'image');
      const zone = zoneFromFile(file, roomObject, source);
      const title = getRoomString(roomObject, source, 'title') || id;
      const description = getDescription(roomObject, source);
      const items = getItems(roomObject, source);
      const exists = assetExists(image);
      const imagePath = imagePathFor(image);
      const recommendedImage = image || `${path.basename(file, '.ts')}.png`;

      return {
        id,
        registryKey: path.basename(file, '.ts'),
        file: path.relative(root, file),
        zone,
        title,
        image,
        imagePath,
        assetPath: `/images/rooms/${recommendedImage}`,
        assetExists: exists,
        configStatus: image ? 'configured' : 'missing-image-field',
        imageAction: exists ? 'existing-asset-ok' : 'request-or-generate',
        description,
        items,
      };
    })
    .filter(Boolean)
    .sort((a, b) => roomSortKey(a).localeCompare(roomSortKey(b)));
}

function writeManifest(rooms) {
  const now = new Date().toISOString();
  const missing = rooms.filter((room) => !room.assetExists || !room.image);
  const lines = [
    '# Gorstan Room Art Manifest',
    '',
    `Generated: ${now}`,
    '',
    'This file is generated from playable room imports in `src/roomRegistry.ts` plus the visual guidance in `docs/clickable-room-bible.md`, `docs/effects-bible.md`, and `docs/sprite-strategy.md`.',
    '',
    `Rooms inventoried: ${rooms.length}`,
    `Rooms requiring image generation or request: ${missing.length}`,
    '',
    '## Missing / Request Queue',
    '',
    missing.length
      ? '| Room | File | Target asset | Reason |\n|---|---|---|---|\n' +
        missing
          .map((room) => `| ${room.title} | \`${room.file}\` | \`${room.assetPath}\` | ${room.configStatus}; ${room.imageAction} |`)
          .join('\n')
      : 'All room modules have configured image paths with matching assets.',
    '',
    '## Room Prompts',
    '',
  ];

  for (const room of rooms) {
    lines.push(
      `### ${room.title}`,
      '',
      `- Room id: \`${room.id}\``,
      `- Registry/file key: \`${room.registryKey}\``,
      `- Source: \`${room.file}\``,
      `- Current image: \`${room.image || '(none)'}\``,
      `- Runtime image path: \`${room.imagePath || '(none)'}\``,
      `- Target asset path: \`${room.assetPath}\``,
      `- Asset status: ${room.assetExists ? 'exists' : 'missing'}`,
      `- Next image action: ${room.imageAction}`,
      '',
      'Final art prompt:',
      '',
      '```text',
      promptFor(room),
      '```',
      '',
    );
  }

  fs.writeFileSync(outFile, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Wrote ${path.relative(root, outFile)}`);
  console.log(`Rooms: ${rooms.length}`);
  console.log(`Missing/request queue: ${missing.length}`);
}

writeManifest(readRooms());
