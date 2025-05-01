// /src/engine/eventTriggers.js
// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.0.0

import { dialogueMemory } from './dialogueMemory';

export function onEnterRoom(roomName, storyStage = 1) {
  const events = {
    'Reset Room': () => {
      if (storyStage >= 2) {
        return 'A sign in your handwriting reads: "Do not push this button." The dome pulses faintly.';
      }
      return 'The dome hums quietly. A blue button pulses at the centre.';
    },
    'Library of the Nine': () => {
      return 'Rows of books whisper as if they remember your name.';
    },
    'storagechamber': () => {
      return 'Dust swirls. Copies of Gorstan and weathered books line the walls. Something about this place feels watched.';
    },
    'Hidden Aevira Lab': () => {
      return 'You feel static cling to your skin. Something was left unfinished here.';
    },
    'Burger Joint': () => {
      return 'The smell of fried oil hangs in the air. The chef eyes you from the back.';
    },
    'greasystoreroom': () => {
      return 'Stacks of old packaging and a suspicious napkin sit beside a leaking fridge.';
    },
    'Findlaters Café Office': () => {
      return 'A quiet hum of refrigeration and stale coffee. Someone left in a hurry.';
    },
    'Pollysbay': () => {
      return 'You step onto cracked tiles. The walls flicker with projection static, this is not a seaside bay no matter what the appearance is. This place is too clean.';
    },
    'Control Room': () => {
      return 'Panels blink erratically. Something behind the console feels... aware.';
    },
    'Crossing': () => {
      return 'This place doesn’t belong to any one timeline. It watches you pass.';
    },
    'Trent Park London': () => {
      return 'Crows circle overhead. The gatehouse feels more guarded than usual.';
    },
    'Observation Deck': () => {
      return 'You peer through reinforced glass. The stars are wrong.';
    },
    "Rhiannon's Chamber": () => {
      return 'Glyphs pulse across the walls. A mirror in the centre shows not your reflection, but possibilities.';
    },
    "The Arbiter's Core": () => {
      return 'A silence here cuts deep. Something dormant... judges.';
    }
  };

  const base = events[roomName]?.() || null;
  const hint = dialogueMemory.triggerUnpromptedHint(roomName, storyStage);

  return [base, hint].filter(Boolean).join(' ');
}
