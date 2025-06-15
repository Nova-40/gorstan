/**
 * File: src/engine/endingLogic.js
 * Gorstan Game – v3.0.5
 * MIT License
 * © 2025 Geoff Webster – Gorstan Game Project
 *
 * Purpose: Module logic for Gorstan game (description TBD).
 */


// Gorstan Game Module — v3.0.0
import { playerHasTrait } from './traitHelpers';

export function resolveEnding(state) {
  if (playerHasTrait("Empath", state)) {
    return {
      ending: "PeacefulResolution",
      message: "You speak not with power, but with understanding. The machine stops. The silence is beautiful."
    };
  }

  if (playerHasTrait("PollysFavourite", state)) {
    return {
      ending: "PollyIntervention",
      message: "Polly cackles. 'I like you. Let’s blow this place up.' She presses a button. Fade to white."
    };
  }

  return {
    ending: "Default",
    message: "You step into the light. Whatever comes next, you've earned it."
  };
}