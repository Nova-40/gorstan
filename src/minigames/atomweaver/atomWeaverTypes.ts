export type AtomPiece = "P" | "N" | "E" | "S"; // Proton, Neutron, Electron, Superposed

export interface NucleusSpec {
  symbol: string;
  Z: number; // protons
  N: number; // neutrons
}

export interface AtomWeaverState {
  grid: string[]; // ASCII lines or serialized grid
  score: number;
  level: number;
}

export interface AtomWeaverProps { seed?: string; roomId?: string }
