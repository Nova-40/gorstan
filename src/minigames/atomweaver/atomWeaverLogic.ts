import { AtomPiece } from "./atomWeaverTypes";

// Minimal helpers and TODOs for full implementation
export function randomPiece(seed?: string): AtomPiece {
  // TODO: deterministic RNG based on seed
  const pool: AtomPiece[] = ["P","N","E","S"];
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx] as AtomPiece;
}

export function validateNucleus(Z:number, N:number) {
  // TODO: implement full table; simplistic check for now
  if (Z <=0) return false;
  return true;
}
