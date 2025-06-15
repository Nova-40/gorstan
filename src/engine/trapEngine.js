/**
 * File: src/engine/trapEngine.js
 * Gorstan Game – v3.0.5
 * MIT License
 * © 2025 Geoff Webster – Gorstan Game Project
 *
 * Purpose: Module logic for Gorstan game (description TBD).
 */


// Gorstan Game Module — v3.0.0
import { playerHasTrait } from './traitHelpers';

export function checkTrap(room, state, dispatch) {
  if (!room.trap) return;

  if (playerHasTrait("PollysFavourite", state) && room.trap.source === "Polly") {
    dispatch({ type: "ADD_MESSAGE", payload: "The trap fizzles out. Polly must like you." });
    return;
  }

  let damage = room.trap.damage;

  if (playerHasTrait("Ironclad", state)) {
    damage = Math.floor(damage * 0.5);
  }

  dispatch({ type: "ADJUST_STATS", payload: { health: -damage } });

  if (damage > 0) {
    dispatch({ type: "ADD_MESSAGE", payload: `A trap hits you! You lose ${damage} health.` });
  }
}