/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Audio system for combat sound effects
*/

/** Sound effect definition */
export interface SoundEffect {
  /** Audio file path */
  src: string;
  /** Volume (0-1) */
  volume: number;
  /** Playback rate modifier */
  playbackRate?: number;
  /** Whether to loop */
  loop?: boolean;
  /** Fade in duration (ms) */
  fadeIn?: number;
  /** Fade out duration (ms) */
  fadeOut?: number;
}

/** Sound effect registry */
export const SFX_REGISTRY: Record<string, SoundEffect> = {
  // Combat sounds
  swordSwing: {
    src: '/audio/sword_swing.wav',
    volume: 0.6,
    playbackRate: 1.0
  },
  
  swordHit: {
    src: '/audio/sword_hit.wav',
    volume: 0.7,
    playbackRate: 1.0
  },
  
  parrySuccess: {
    src: '/audio/parry_success.wav',
    volume: 0.8,
    playbackRate: 1.0
  },
  
  parryFail: {
    src: '/audio/parry_fail.wav',
    volume: 0.5,
    playbackRate: 1.0
  },
  
  dodge: {
    src: '/audio/dodge.wav',
    volume: 0.4,
    playbackRate: 1.2
  },
  
  // Spell casting
  spellCast: {
    src: '/audio/spell_cast.wav',
    volume: 0.6,
    playbackRate: 1.0
  },
  
  fireBolt: {
    src: '/audio/fire_bolt.wav',
    volume: 0.7,
    playbackRate: 1.0
  },
  
  frostNova: {
    src: '/audio/frost_nova.wav',
    volume: 0.6,
    playbackRate: 1.0
  },
  
  chainLightning: {
    src: '/audio/chain_lightning.wav',
    volume: 0.8,
    playbackRate: 1.0
  },
  
  blink: {
    src: '/audio/blink.wav',
    volume: 0.5,
    playbackRate: 1.1
  },
  
  ward: {
    src: '/audio/ward.wav',
    volume: 0.6,
    playbackRate: 1.0
  },
  
  timeDilation: {
    src: '/audio/time_dilation.wav',
    volume: 0.4,
    playbackRate: 0.8
  },
  
  // Status effects
  burn: {
    src: '/audio/burn.wav',
    volume: 0.3,
    playbackRate: 1.0
  },
  
  freeze: {
    src: '/audio/freeze.wav',
    volume: 0.5,
    playbackRate: 1.0
  },
  
  shock: {
    src: '/audio/shock.wav',
    volume: 0.6,
    playbackRate: 1.0
  },
  
  // Combat feedback
  criticalHit: {
    src: '/audio/critical_hit.wav',
    volume: 0.9,
    playbackRate: 1.0
  },
  
  stagger: {
    src: '/audio/stagger.wav',
    volume: 0.7,
    playbackRate: 0.9
  },
  
  riposte: {
    src: '/audio/riposte.wav',
    volume: 0.8,
    playbackRate: 1.0
  }
};

/** Audio manager for game sounds */
class AudioManager {
  private audioContext: AudioContext | null = null;
  private audioCache: Map<string, AudioBuffer> = new Map();
  private activeAudio: Map<string, AudioBufferSourceNode> = new Map();
  private masterVolume: number = 1.0;
  private sfxVolume: number = 1.0;

  /** Initialize audio context */
  async init(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext not supported:', error);
    }
  }

  /** Set master volume (0-1) */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /** Set SFX volume (0-1) */
  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  /** Load audio file into cache */
  async loadAudio(src: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;
    
    if (this.audioCache.has(src)) {
      return this.audioCache.get(src)!;
    }

    try {
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioCache.set(src, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load audio: ${src}`, error);
      return null;
    }
  }

  /** Play sound effect */
  async playSFX(id: string, options?: Partial<SoundEffect>): Promise<void> {
    const sfx = SFX_REGISTRY[id];
    if (!sfx || !this.audioContext) return;

    const config = { ...sfx, ...options };
    const audioBuffer = await this.loadAudio(config.src);
    if (!audioBuffer) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = audioBuffer;
    source.playbackRate.value = config.playbackRate || 1.0;
    source.loop = config.loop || false;

    const finalVolume = config.volume * this.sfxVolume * this.masterVolume;
    gainNode.gain.value = finalVolume;

    // Handle fade in
    if (config.fadeIn) {
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        finalVolume,
        this.audioContext.currentTime + config.fadeIn / 1000
      );
    }

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Handle fade out
    if (config.fadeOut && !config.loop) {
      const fadeOutStart = this.audioContext.currentTime + audioBuffer.duration - config.fadeOut / 1000;
      gainNode.gain.setValueAtTime(finalVolume, fadeOutStart);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + audioBuffer.duration);
    }

    // Store for potential stopping
    this.activeAudio.set(id, source);

    source.start();
    source.onended = () => {
      this.activeAudio.delete(id);
    };
  }

  /** Stop specific sound effect */
  stopSFX(id: string): void {
    const source = this.activeAudio.get(id);
    if (source) {
      source.stop();
      this.activeAudio.delete(id);
    }
  }

  /** Stop all active audio */
  stopAll(): void {
    for (const [, source] of this.activeAudio) {
      source.stop();
    }
    this.activeAudio.clear();
  }
}

/** Global audio manager instance */
export const audioManager = new AudioManager();

/** Initialize audio system */
export async function initAudio(): Promise<void> {
  await audioManager.init();
}

/** Play combat sound effect */
export function playCombatSFX(id: string, options?: Partial<SoundEffect>): void {
  audioManager.playSFX(id, options);
}

/** Combat-specific sound helpers */
export const combatAudio = {
  /** Play weapon swing sound */
  weaponSwing: () => playCombatSFX('swordSwing'),
  
  /** Play weapon hit sound */
  weaponHit: () => playCombatSFX('swordHit'),
  
  /** Play parry success sound */
  parrySuccess: () => playCombatSFX('parrySuccess'),
  
  /** Play parry failure sound */
  parryFail: () => playCombatSFX('parryFail'),
  
  /** Play dodge sound */
  dodge: () => playCombatSFX('dodge'),
  
  /** Play spell casting sound */
  spellCast: (spellId?: string) => {
    if (spellId && SFX_REGISTRY[spellId]) {
      playCombatSFX(spellId);
    } else {
      playCombatSFX('spellCast');
    }
  },
  
  /** Play critical hit sound */
  criticalHit: () => playCombatSFX('criticalHit'),
  
  /** Play stagger sound */
  stagger: () => playCombatSFX('stagger'),
  
  /** Play riposte sound */
  riposte: () => playCombatSFX('riposte'),
  
  /** Play status effect sound */
  statusEffect: (statusId: string) => {
    const sfxId = statusId.toLowerCase();
    if (SFX_REGISTRY[sfxId]) {
      playCombatSFX(sfxId);
    }
  }
};
