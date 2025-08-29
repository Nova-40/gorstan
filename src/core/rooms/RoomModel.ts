
export type TeleportStyle = 'fractal' | 'trek';
export type Zone = 'glitch' | 'nexus' | 'elfhame' | 'maze' | 'default';

export interface RoomExit { to: string; label: string }
export interface RoomAction { id: string; label: string; effects: string[] }

export interface RoomDef {
  id: string;
  title: string;
  zone: Zone;
  enterText: string[];
  exits: RoomExit[];
  // Optional content fields
  teleportStyle?: TeleportStyle;
  unlocksLore?: string[];
  objectiveHints?: string[];
  ambient?: string; // e.g. '/audio/amb/control_loop.ogg'
  actions?: RoomAction[];
}
