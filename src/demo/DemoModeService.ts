import { demoController, stopDemo } from './demoController';
import { startDemo as startDemoRoute } from './demoRouter';
import { setDemoRunning } from './state';
import { track } from '../lib/analytics';

export type BannerSetter = (text?: string) => void;

export class DemoModeService {
  private setOverlayBanner: BannerSetter | undefined;

  constructor(setOverlayBanner?: BannerSetter) {
    this.setOverlayBanner = setOverlayBanner;
  }

  public setBannerSetter(setter?: BannerSetter) {
    this.setOverlayBanner = setter;
  }

  public async start(packId?: string) {
    setDemoRunning(true);
    try {
      this.setOverlayBanner?.('Autoplay Demo — press ESC to regain control');
      track?.('demo_start', { packId });
    } catch {}
    // delegate to demo router (start selected route if provided)
    if (packId) {
      await startDemoRoute(packId);
    } else {
      await startDemoRoute('trials-of-gorstan');
    }
  }

  public stop(reason?: string) {
    setDemoRunning(false);
    try {
      this.setOverlayBanner?.(undefined);
      track?.('demo_stop', { reason });
    } catch {}
    stopDemo();
  }

  public sanitizeCommand(cmd: string, whitelist: string[]) {
    const c = (cmd || '').toLowerCase().trim();
    return whitelist.includes(c) ? c : 'look';
  }
}

export const demoService = new DemoModeService();
