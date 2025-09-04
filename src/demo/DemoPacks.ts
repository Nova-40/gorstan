export type DemoStyle = "scripted" | "groqHinted" | "pureGroq";

export interface DemoStep {
  say?: string;
  cmd?: string;
  goal?: string;
  waitMs?: number;
}

export interface DemoPack {
  id: string;
  name: string;
  style: DemoStyle;
  entryRoom: string;
  steps: DemoStep[];
  allowMinigames?: boolean;
}

export const DEMO_PACKS: DemoPack[] = [
  {
    id: "quantum_sampler",
    name: "Quantum Magic Sampler",
    style: "groqHinted",
    entryRoom: "controlnexus.core",
    allowMinigames: true,
    steps: [
      { say: "Booting lattice…", goal: "show quantum action then talk to Ayla" },
      { goal: "trigger a quantum miniquest" },
      { goal: "exit miniquest and move east or west" },
      { goal: "interact with a device" }
    ]
  },
  {
    id: "trent_park_demo",
    name: "Trent Park Dawn Heist",
    style: "scripted",
    entryRoom: "trentpark.dawn",
    steps: [
      { say:"Dawn over Trent Park.", cmd:"look" },
      { say:"Shadows move.", cmd:"west" },
      { say:"Eyes on the guards.", cmd:"listen" },
      { say:"Show mirror trick.", cmd:"play quantumMirror" },
      { say:"Slip past.", cmd:"north" },
      { say:"A quiet word.", cmd:"talk" }
    ]
  }
];
