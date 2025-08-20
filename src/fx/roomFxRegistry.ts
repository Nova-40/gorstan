import type { RoomFXSpec } from "../components/AmbientFX/AnimatedBackdrop";
import { builtinFxByRoomId } from "../components/AmbientFX/specs";

// If you have RoomId type, use it instead of string
const overrides: Record<string, RoomFXSpec | null> = {
  // Add custom per-room tweaks or disable by setting null
  // e.g., "SomeDarkRoom": null,
};

export function getRoomFX(roomId: string): RoomFXSpec | null {
  return overrides[roomId] ?? builtinFxByRoomId[roomId] ?? null;
}
