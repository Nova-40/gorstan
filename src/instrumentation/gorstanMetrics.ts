/*
  Gorstan – Interactive Game Framework
  Copyright © 2025 Geoff Webster. All Rights Reserved.

  This source code is proprietary and confidential.
  Unauthorised copying, distribution, modification, resale,
  reverse engineering, or use of this file, via any medium,
  is strictly prohibited without prior written consent
  from the copyright holder.

  Licensed access is granted only to authorised users who have
  purchased access to Gorstan through official channels.
  Such licence is strictly limited to running and playing the
  Gorstan game. No part of this source code may be used to
  create derivative works, other games, or redistributed in
  any form.

  Third-party libraries and assets are included under their
  respective licences as detailed in package.json and assets/.
*/

interface Snapshot {
  modulePath: string;
  fpsAvg: number;
  inputLatencyMs?: number | undefined;
  deathsPerMinute?: number | undefined;
  a11yViolations?: number | undefined;
}

class MetricsProbe {
  private frames = 0;
  private start = performance.now();
  private deaths = 0; // removed unused lastInputAt/lastDeathAt
  private latencies: number[] = [];
  private modulePath = 'arcade/CatacombeDash';
  emitQueue: Snapshot[] = [];

  noteFrame() { this.frames++; }
  noteInput(ts = performance.now()) { this.latencies.push(performance.now() - ts); }
  noteDeath() { this.deaths++; }
  setModule(path: string) { this.modulePath = path; }
  snapshot(): Snapshot {
    const elapsedMin = (performance.now() - this.start)/60000;
    const fpsAvg = this.frames / ((performance.now()-this.start)/1000);
    const deathsPerMinute = elapsedMin > 0 ? this.deaths / elapsedMin : 0;
    const inputLatencyMs = this.latencies.length ? this.latencies.reduce((a,b)=>a+b,0)/this.latencies.length : undefined;
    return { modulePath: this.modulePath, fpsAvg: Number(fpsAvg.toFixed(1)), inputLatencyMs: inputLatencyMs && Number(inputLatencyMs.toFixed(1)), deathsPerMinute: Number(deathsPerMinute.toFixed(2)) };
  }
  flush() {
    const snap = this.snapshot();
    try {
      const existing = JSON.parse(localStorage.getItem('gorstan.playMetrics')||'{}');
      existing[snap.modulePath] = { ...existing[snap.modulePath], ...snap };
      localStorage.setItem('gorstan.playMetrics', JSON.stringify(existing));
    } catch {}
    return snap;
  }
}

// Attach to window once
if (typeof window !== 'undefined') {
  const g: any = window as any;
  if (!g.gorstanMetrics) g.gorstanMetrics = new MetricsProbe();
  window.addEventListener('gorstan-beat', (e: any) => {
    try {
      const beat = e.detail;
      const root = document.documentElement;
      if (beat) root.setAttribute('data-beat', beat);
    } catch {}
  });
}

export {}; // side-effect module