
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const roomsPath = path.join(__dirname, '..', 'src', 'data', 'rooms.json');
const schemaPath = path.join(__dirname, '..', 'dist', 'schema.cjs'); // We'll bundle a cjs helper or run ts-node in real CI

// Lightweight inline validation without ts build (duplicate minimal logic)
function validate(obj){
  const zones = new Set(['glitch','nexus','elfhame','maze','default']);
  const ids = Object.keys(obj);
  for (const [id, room] of Object.entries(obj)){
    if (!room.id || !room.title) throw new Error(`Room ${id} missing id/title`);
    if (!Array.isArray(room.enterText) || room.enterText.length < 1) throw new Error(`Room ${id} missing enterText[0]`);
    if (!zones.has(room.zone)) throw new Error(`Room ${id} has invalid zone '${room.zone}'`);
    if (!Array.isArray(room.exits)) throw new Error(`Room ${id} exits must be an array`);
  }
  const idset = new Set(ids);
  const bad = [];
  for (const [id, room] of Object.entries(obj)){
    for (const ex of room.exits){
      if (!idset.has(ex.to)) bad.push(`${id} -> ${ex.to}`);
    }
  }
  if (bad.length) throw new Error('Exits to missing rooms: ' + bad.join(', '));
  return true;
}

try {
  const raw = readFileSync(roomsPath, 'utf-8');
  const data = JSON.parse(raw);
  validate(data);
  console.log('rooms.json OK');
} catch (e) {
  console.error(String(e));
  process.exit(1);
}
