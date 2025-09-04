
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
  // Optional content fields (allow undefined explicitly for exactOptionalPropertyTypes)
  teleportStyle?: TeleportStyle | undefined;
  unlocksLore?: string[] | undefined;
  objectiveHints?: string[] | undefined;
  ambient?: string | undefined; // e.g. '/sounds/amb/control_loop.ogg' (fallback to /audio/ for legacy)
  actions?: RoomAction[] | undefined;
}
