// src/engine/roomLoader.js
import gorstan from '../zones/gorstanZone.json';
import london from '../zones/londonZone.json';
import elfhame from '../zones/elfhameZone.json';
import glitch from '../zones/glitchZone.json';
import intro from '../zones/introZone.json';
import lattice from '../zones/latticeZone.json';
import maze from '../zones/mazeZone.json';
import multi from '../zones/multiZone.json';
import offgorstan from '../zones/offgorstanZone.json';
import offmultiverse from '../zones/offmultiverseZone.json';
import newyork from '../zones/newyorkZone.json';
import prewelcome from '../zones/prewelcomeZone.json';
import reset from '../zones/resetZone.json';
import stanton from '../zones/stantonharcourtZone.json';

const allZones = [
  gorstan, london, elfhame, glitch, intro, lattice, maze, multi,
  offgorstan, offmultiverse, newyork, prewelcome, reset, stanton
];

const allRooms = allZones.flatMap(zone => zone.rooms);

export default allRooms;