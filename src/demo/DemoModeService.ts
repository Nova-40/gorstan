import { DEMO } from "@/config";
import { DEMO_COMMAND_WHITELIST } from "./CommandWhitelist";
import { DEMO_PACKS, DemoPack } from "./DemoPacks";
import { groqSuggestCommand } from "./GroqClient";

export type DemoStatus = "idle" | "running" | "finished" | "aborted";

export class DemoModeService {
  private status: DemoStatus = "idle";
  private stepIndex = 0;
  private stepsExecuted = 0;
  private controller?: AbortController;

  constructor(
    private sendInput: (cmd: string) => void,
    private getSnapshot: () => { roomId: string; transcript: string[]; inventory: string[]; visibleWords: string[]; },
    private warpToRoom: (roomId: string) => void,
    private setOverlayBanner?: (text?: string) => void
  ) {}

  start(packId: string) {
    const pack = DEMO_PACKS.find(p => p.id === packId);
    if (!pack) return;
    this.status = "running";
    this.stepIndex = 0;
    this.stepsExecuted = 0;
    this.warpToRoom(pack.entryRoom);
    this.setOverlayBanner?.("Autoplay Demo — press ESC to regain control");
    void this.loop(pack);
  }

  stop(reason: "finished" | "aborted" = "aborted") {
    this.controller?.abort();
    this.status = reason;
    this.setOverlayBanner?.(undefined);
  }

  private async loop(pack: DemoPack) {
    while (this.status === "running" && this.stepsExecuted < DEMO.MAX_STEPS_PER_DEMO) {
      const snapshot = this.getSnapshot();
      const step = pack.steps[Math.min(this.stepIndex, pack.steps.length - 1)];
      let nextCmd = step?.cmd;

      if (!nextCmd) {
        this.controller = new AbortController();
        const allowed = Array.from(DEMO_COMMAND_WHITELIST);
        try {
          const suggestion = await groqSuggestCommand({
            roomId: snapshot.roomId,
            recentTranscript: snapshot.transcript.slice(-6),
            inventory: snapshot.inventory,
            visible: snapshot.visibleWords,
            goals: [step?.goal ?? "explore safely"],
            allowed
          }, this.controller.signal);
          nextCmd = suggestion;
        } catch { nextCmd = "look"; }
      }

      this.sendInput(nextCmd || "look");
      this.stepsExecuted++;
      if (pack.style !== "pureGroq") this.stepIndex++;

      const wait = step?.waitMs ?? DEMO.INPUT_INTERVAL_MS;
      await new Promise(r => setTimeout(r, wait));
    }
    this.stop("finished");
  }
}
