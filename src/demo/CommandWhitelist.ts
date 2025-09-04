export const DEMO_COMMAND_WHITELIST = [
  "north","south","east","west","up","down","enter","exit","wait",
  "look","examine","search","read","listen","smell","inventory",
  "talk","ask","use","take","drop","open","close","unlock",
  "quantum","collapse","entangle","stabilise",
  "aim","strike","parry","dodge","cast",
  "play atomWeaver","play paradoxRunner","play quantumMirror",
  "play colliderRoyale","play doubleSlitRun","play dominicCyclotronSwim",
  "play feynmanPaths","play latticeEngine"
] as const;

export type DemoCmd = (typeof DEMO_COMMAND_WHITELIST)[number];
