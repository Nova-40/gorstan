
import imagesJson from '../../data/roomImages.json';

type Zone = 'nexus' | 'glitch' | 'elfhame' | 'maze' | 'default';

type ImagesRegistry = {
  _zoneDefaults: Record<Zone, string>,
  images: Record<string, string>
};

const registry = imagesJson as ImagesRegistry;

export function getRoomImagePath(roomId: string, zone: Zone): string | null {
  const byId = registry.images[roomId];
  if (byId) return byId;
  const byZone = registry._zoneDefaults[zone] || registry._zoneDefaults.default;
  return byZone || null;
}
