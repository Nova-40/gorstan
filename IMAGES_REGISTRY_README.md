
# Room Images Registry

The app now resolves visuals from a single registry:

- `src/data/roomImages.json` — `images` map for specific rooms, plus `_zoneDefaults` fallbacks.
- `RoomRenderer` calls `getRoomImagePath(roomId, zone)`; if nothing found, it shows a safe gradient panel.

## Adding images
- Drop assets under `/public/images/...`
- Add mapping in `roomImages.json`:
  ```json
  {
    "images": {
      "glitchrealm": "/images/glitchrealm-zoneravenroom.png"
    }
  }
  ```
- Optionally set better `_zoneDefaults` when you add zone-specific art.

