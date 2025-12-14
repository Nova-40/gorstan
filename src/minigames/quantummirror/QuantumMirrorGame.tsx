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
      // provide a typed cast for the quest id string so we don't rely on @ts-expect-error
      questId: "quantumMirror" as unknown as any,
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
        <BoardView title="Board A (edit)" board={a} onClick={(x,y)=>{ setA(s=>toggle(s,x,y)); }} />
        <BoardView title="Board B (match target)" board={b} onClick={(x,y)=>{ setB(s=>toggle(s,x,y)); setMoves(m=>m+1); }} />
      </div>
      <div className="miniquest-legend">
        Change coupling:
        {RULES.map(r => (
          <button key={r} onClick={()=>setRule(r)} style={{marginLeft:8}}>{r}</button>
        ))}
        <button style={{marginLeft:16}} onClick={() => onCancel()}>ESC</button>
      </div>
    </div>
  );
}

function BoardView({ title, board, onClick }:{ title:string; board:{w:number;h:number;cells:("."|"#")[]}; onClick:(x:number,y:number)=>void }){
  return (
    <div>
      <div style={{marginBottom:6}}>{title}</div>
      <pre style={{cursor:"pointer", lineHeight: '14px', fontSize:12}}>{
        Array.from({length:board.h}).map((_,y)=>{
          let row="";
          for(let x=0;x<board.w;x++){
            const c = board.cells[y*board.w+x];
            row += c === "." ? "·" : "#";
          }
          return row+"\n";
        }).join("")
      }</pre>
      <div style={{display:"grid", gridTemplateColumns:`repeat(${board.w}, 16px)`, gap:2}}>
        {Array.from({length:board.w*board.h}).map((_,i)=>{
          const x=i%board.w, y=(i/board.w|0);
          return <div key={i} onClick={()=>onClick(x,y)} style={{width:16,height:16, background: board.cells[i]==="."?"#1b1f24":"#9fe", border:'1px solid #000'}} />;
        })}
      </div>
    </div>
  );
}
