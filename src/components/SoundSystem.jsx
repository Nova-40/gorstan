
import React from 'react';

export default function SoundSystem({ muted, toggleMute }) {
  return (
    <div className="absolute top-2 right-2">
      <button
        onClick={toggleMute}
        className="text-green-400 hover:text-red-400 font-bold bg-black bg-opacity-50 px-3 py-1 rounded"
        title={muted ? 'Unmute sound' : 'Mute sound'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}

// Usage example for sound playback:
export function playSound(name, muted = false) {
  if (muted) return;
  try {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.play().catch((e) => console.warn('🔇 Sound failed:', e));
  } catch (err) {
    console.warn('🔇 Audio error:', err);
  }
}
