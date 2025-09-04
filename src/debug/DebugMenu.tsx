import { useMemo, useState } from "react";
import { DEMO_PACKS } from "@/demo/DemoPacks";
import "./debugStyles.css";

export function DebugMenu({
  onStartDemo, onStopDemo, onClose
}: {
  onStartDemo: (packId: string) => void;
  onStopDemo: () => void;
  onClose: () => void;
}) {
  const packs = useMemo(() => DEMO_PACKS, []);
  const [sel, setSel] = useState(packs[0]?.id ?? "");

  return (
    <div className="debug-menu-overlay">
      <div className="debug-menu">
        <header>
          <h3>Debug Menu</h3>
          <button onClick={onClose}>✕</button>
        </header>

        <section>
          <h4>Autoplay Demo</h4>
          <select value={sel} onChange={e=>setSel(e.target.value)}>
            {packs.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="actions">
            <button onClick={() => onStartDemo(sel)}>Start Demo</button>
            <button onClick={() => onStopDemo()}>Stop</button>
          </div>
        </section>
      </div>
    </div>
  );
}
