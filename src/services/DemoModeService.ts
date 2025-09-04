/*
  DemoModeService
  Central coordinator for new Demo Mode packs (scripted vs hinted)
  - Manages active demo pack lifecycle
  - Provides start/stop API for Debug Menu + Gate
  - Emits lightweight analytics events via track()
*/
import { track } from '@/lib/analytics';
import { GameMode } from '@/types/game';
import { useGate } from '@/state/GateContext';

export type DemoPackType = 'scripted' | 'groq-hinted';
export interface DemoPackDefinition {
  id: string;
  title: string;
  type: DemoPackType;
  rooms?: string[]; // targeted rooms / waypoints
  script?: () => Promise<void>; // for scripted packs
}

const PACKS: DemoPackDefinition[] = [
  { id:'quantum-magic-sampler', title:'Quantum Magic Sampler', type:'groq-hinted' },
  { id:'trent-park-dawn-heist', title:'Trent Park Dawn Heist', type:'scripted' }
];

class DemoModeServiceImpl {
  private activePack: DemoPackDefinition | null = null;
  private active = false;
  getActivePack() { return this.activePack; }
  listPacks() { return PACKS; }
  isActive() { return this.active; }
  async start(packId: string) {
    if (this.active) return;
    const pack = PACKS.find(p => p.id === packId) ?? PACKS[0];
    if (!pack) return; // safety
    this.activePack = pack; this.active = true;
    track('demo_start', { pack: pack.id });
    // Scripted execution placeholder
    if (pack.type === 'scripted' && pack.script) {
      try { await pack.script(); } catch { /* swallow demo errors */ }
    }
  }
  stop(reason: string = 'user') {
    if (!this.active) return;
    const pack = this.activePack;
    this.active = false; this.activePack = null;
    track('demo_stop', { pack: pack?.id, reason });
  }
}

export const DemoModeService = new DemoModeServiceImpl();

// Hook helper (optional) to integrate with GateContext outside imperative calls
export function useDemoMode() {
  const gate = useGate();
  return {
    active: gate.mode === GameMode.DEMO || DemoModeService.isActive(),
    pack: DemoModeService.getActivePack(),
    start: DemoModeService.start.bind(DemoModeService),
    stop: (reason?:string) => { DemoModeService.stop(reason); gate.setMode(GameMode.LOCKED); }
  };
}
