export type Cell = "." | "#";
export interface Board { w:number; h:number; cells: Cell[]; }
export interface MirrorState { a: Board; b: Board; moves: number; target: string; }

export function makeBoard(w=6,h=6, fill:Cell="."): Board {
  return { w, h, cells: Array(w*h).fill(fill) as Cell[] };
}
export function idx(w:number,x:number,y:number){ return y*w + x; }

export type MirrorRule = "mirrorX" | "mirrorY" | "transpose";
export function applyRule(b: Board, rule: MirrorRule): Board {
  const out: Board = { w:b.w, h:b.h, cells: Array(b.w*b.h).fill(".") as Cell[] };
  for(let y=0;y<b.h;y++) for(let x=0;x<b.w;x++){
    const i = idx(b.w,x,y);
    let nx=x, ny=y;
    if (rule==="mirrorX") nx = b.w-1-x;
    if (rule==="mirrorY") ny = b.h-1-y;
    if (rule==="transpose"){ nx=y; ny=x; }
  out.cells[idx(b.w,nx,ny)] = b.cells[i] ?? '.';
  }
  return out;
}
export function toggle(b: Board, x:number,y:number): Board {
  const out: Board = { ...b, cells: [...b.cells] };
  const i = idx(b.w,x,y);
  out.cells[i] = (out.cells[i]===".") ? "#" : ".";
  return out;
}
export function boardKey(b: Board){ return b.cells.join(""); }
