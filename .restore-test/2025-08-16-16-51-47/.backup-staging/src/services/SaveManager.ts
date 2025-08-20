/*
  SaveManager - Handles save/load operations, validation, and migration.
*/

export interface SaveFile {
  version: number;
  playerName: string;
  progress: any; // Replace with a more specific type if available
  timestamp: string;
}

export class SaveManager {
  public static CURRENT_VERSION = 1;

  /**
   * Validate a save file's integrity.
   * @param saveFile The save file to validate.
   * @returns True if valid, false otherwise.
   */
  static validate(saveFile: SaveFile): boolean {
    if (!saveFile || typeof saveFile.version !== 'number' || !saveFile.playerName || !saveFile.timestamp) {
      return false;
    }
    return true;
  }

  /**
   * Migrate an old save file to the current version.
   * @param saveFile The save file to migrate.
   * @returns The migrated save file.
   */
  static migrate(saveFile: SaveFile): SaveFile {
    let migratedFile = { ...saveFile };

    while (migratedFile.version < this.CURRENT_VERSION) {
      switch (migratedFile.version) {
        case 0:
          // Example migration logic from version 0 to 1
          migratedFile = {
            ...migratedFile,
            version: 1,
            timestamp: new Date().toISOString(),
          };
          break;
        default:
          throw new Error(`Unsupported save file version: ${migratedFile.version}`);
      }
    }

    return migratedFile;
  }

  /**
   * Save a file to local storage.
   * @param slot The save slot to use.
   * @param saveFile The save file to save.
   */
  static save(slot: number, saveFile: SaveFile): void {
    const key = `save_slot_${slot}`;
    localStorage.setItem(key, JSON.stringify(saveFile));
  }

  /**
   * Load a save file from local storage.
   * @param slot The save slot to load from.
   * @returns The loaded save file, or null if not found.
   */
  static load(slot: number): SaveFile | null {
    const key = `save_slot_${slot}`;
    const data = localStorage.getItem(key);
    if (!data) return null;

    const saveFile: SaveFile = JSON.parse(data);
    if (!this.validate(saveFile)) {
      console.warn(`Invalid save file in slot ${slot}.`);
      return null;
    }

    return this.migrate(saveFile);
  }

  /**
   * List all available save slots with metadata.
   * @returns An array of metadata for each save slot.
   */
  static listSlots(): Array<{ slot: number; playerName: string; timestamp: string }> {
    const slots = [];
    for (let i = 0; i < 10; i++) {
      const saveFile = this.load(i);
      if (saveFile) {
        slots.push({
          slot: i,
          playerName: saveFile.playerName,
          timestamp: saveFile.timestamp,
        });
      }
    }
    return slots;
  }
}
