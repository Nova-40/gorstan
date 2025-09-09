/**
 * Audio priming utility - ensures AudioContext is resumed after user gesture
 * Follows browser autoplay policies
 */

let primed = false;

export function ensureAudioPrimed(): void {
  if (primed) {
    return;
  }

  const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  try {
    const ctx = (window as any).__gorstanAC || new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    (window as any).__gorstanAC = ctx;
    primed = true;
    console.log('🔊 Audio context primed successfully');
  } catch (error) {
    console.warn('⚠️ Audio priming failed:', error);
  }
}

export default ensureAudioPrimed;
