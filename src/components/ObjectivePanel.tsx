// React import removed (using automatic JSX runtime)
import { useGameState } from '../state/gameState';

interface ObjectiveLike { id: string; title: string; done?: boolean; }

export default function ObjectivePanel(){
  const { state } = useGameState();
  const fallbackObjectives: ObjectiveLike[] = [
    { id: 'power-control-nexus', title: 'Power the Control Nexus', done: !!state.flags?.blueButtonPressed },
    { id: 'discover-coin', title: "Discover the Schrödinger Coin", done: !!state.flags?.coinDiscovered },
    { id: 'use-coin', title: 'Use the Coin in Glitchrealm', done: !!state.flags?.coinUsed },
    { id: 'unlock-glitchrealm', title: 'Unlock Glitchrealm lore', done: !!state.flags?.glitch_lore_unlocked },
  ];
  const objectives: ObjectiveLike[] = Array.isArray((state as any).objectives) ? (state as any).objectives : fallbackObjectives;
  return (
    <div className="border border-green-700 rounded-2xl p-3 bg-black/60 mb-2">
      <div className="font-semibold mb-1">Objectives</div>
      <ul className="space-y-1">
        {objectives.map(o => (
          <li key={o.id} className="flex items-center gap-2">
            <span aria-hidden>{o.done ? '✓' : '•'}</span>
            <span className={o.done ? 'line-through text-green-500/70' : ''}>{o.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
