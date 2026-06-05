import React from "react";
import type { MiniQuestProps, MiniQuestResult } from "../core/MiniQuestTypes";
import { makeBoard, applyRule, toggle, boardKey, MirrorRule } from "./logic";

const RULES: MirrorRule[] = ["mirrorX","mirrorY","transpose"];

export default function QuantumMirrorGame({ onCancel, onComplete, isDemo }: MiniQuestProps) {
  const [a,setA] = React.useState(() => makeBoard());
  const [b,setB] = React.useState(() => makeBoard());
  const [rule,setRule] = React.useState<MirrorRule>("mirrorX");
  const [moves,setMoves] = React.useState(0);
  const start = React.useRef(Date.now());

  const target = React.useMemo(()=> boardKey(applyRule(a, rule)), [a, rule]);
  const win = React.useMemo(()=> boardKey(b) === target, [b, target]);

  React.useEffect(()=> {
    if (!isDemo) return;
    const t = setTimeout(()=> finish("partial"), 65000);
    return () => clearTimeout(t);
  }, [isDemo]);

  function finish(outcome:"win"|"loss"|"partial") {
    const res: MiniQuestResult = {
      questId: "quantumMirror",
      outcome,
      score: Math.max(0, 500 - moves*25),
      durationMs: Date.now()-start.current,
      metadata: { rule }
    };
    onComplete(res);
  }

  React.useEffect(()=> { if (win) finish("win"); }, [win]);

  return (
    <div className="miniquest-surface" role="application" aria-label="Quantum Mirror">
      <div className="miniquest-hud">Quantum Mirror · Moves {moves} · Rule {rule} · ESC to exit</div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
        <Board title="A" board={a} onCell={(r,c)=>{setA(toggle(a,r,c)); setMoves(m=>m+1);}} />
        <Board title="B" board={b} onCell={(r,c)=>{setB(toggle(b,r,c)); setMoves(m=>m+1);}} />
      </div>
      <div style={{marginTop:16, display:"flex", gap:8}}>
        {RULES.map(r=> <button key={r} onClick={()=>setRule(r)} aria-pressed={rule===r}>{r}</button>)}
        <button onClick={onCancel}>Exit</button>
      </div>
    </div>
  );
}

function Board({title, board, onCell}:{title:string; board:number[][]; onCell:(r:number,c:number)=>void}) {
  return <div><h3>{title}</h3><div style={{display:"grid", gridTemplateColumns:"repeat(5,32px)", gap:4}}>{board.map((row,r)=>row.map((v,c)=><button key={`${r}-${c}`} onClick={()=>onCell(r,c)} style={{width:32,height:32}}>{v?"●":"○"}</button>))}</div></div>;
}
