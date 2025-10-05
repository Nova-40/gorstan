/*
  TrialsManager - central orchestrator for the Trials of Gorstan
  Provides shared death counter, rest-rock management, hints, and lore hooks
*/

export interface Position { x: number; y: number }

export interface RestRockState {
  id: number;
  x: number;
  y: number;
  cooldownUntil: number;
}

export class TrialsManager {
  public deathCount = 0;
  public readonly maxDeaths = 3;
  public playerStart: Position = { x: 0, y: 0 };
  private restRocks: RestRockState[] = [];

  constructor() {
    // Default rest rocks used in Phase 3
    this.restRocks = [
      { id: 0, x: 10, y: 6, cooldownUntil: 0 },
      { id: 1, x: 22, y: 18, cooldownUntil: 0 },
      { id: 2, x: 32, y: 8, cooldownUntil: 0 },
    ];
  }

  recordDeath(): boolean {
    this.deathCount += 1;
    console.log(`[TrialsManager] Death recorded. Total deaths: ${this.deathCount}/${this.maxDeaths}`);
    return this.deathCount >= this.maxDeaths;
  }

  isGameOver(): boolean {
    return this.deathCount >= this.maxDeaths;
  }

  resetDeaths(): void {
    this.deathCount = 0;
  }

  getRestRocks(): RestRockState[] {
    return this.restRocks.map((r) => ({ ...r }));
  }

  useRestRock(id: number): boolean {
    const rock = this.restRocks.find((r) => r.id === id);
    if (!rock) return false;
    const now = Date.now();
    if (now < rock.cooldownUntil) return false;
    rock.cooldownUntil = now + 25000; // 25s cooldown default
    return true;
  }

  showHint(phase: string): string[] {
    const hints: Record<string, string[]> = {
      'rock-field': [
        'Time your dashes between waves. Use rest rocks to reset.',
        'Start from the safe top-left tile and study the roll patterns.',
      ],
      'rock-gauntlet': [
        'Time your dashes between waves. Use rest rocks to reset.',
        'Start from the safe top-left tile and study the roll patterns.',
      ],
      'random-rocks': [
        'Observe the rhythm. Precision beats panic.',
        'Look for sheltered pockets to time your sprints.',
      ],
      'mushroom-field': [
        'Force predators toward rest rocks or the stream. Timing matters.',
        'Avoid triggering chain reactions unless you can reach a safety rock.',
      ],
    };

    return hints[phase] ?? [];
  }

  getShortBlurb(): string {
    return 'The Trials of Gorstan — Navigate a jagged rockfield, dodge rolling boulders, and survive a frenzied mushroom marsh.';
  }

  getSynopsis(): string {
    return (
      'Three escalating tests of timing, nerve, and strategy.\n' +
      'Phase 1: Rock Gauntlet.\n' +
      'Phase 2: Random Rocks Barrage.\n' +
      'Phase 3: Mushroom Field — reach the stream to cleanse the field.'
    );
  }

  displayLore(phase: string): void {
    const lore: Record<string, string> = {
      'rock-field': 'The stones remember weight and history…',
      'random-rocks': 'Travelers whisper that the boulders roll to test not just your feet but your patience…',
      'mushroom-field': 'The mushrooms hum with a hunger… The stream beyond is small mercy.',
    };

    const text = lore[phase] || '';
    if (text) {
      console.log(`[TrialsManager] Lore: ${text}`);
    }
  }
}

export default TrialsManager;
