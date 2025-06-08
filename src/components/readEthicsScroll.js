// Gorstan Game Module — v3.0.0
import { playerHasTrait } from '../utils/traitHelpers';

export function readItem(itemId, state) {
  if (itemId !== 'ethicsScroll') return null;

  if (!state.inventory.includes('ethicsScroll')) {
    return { message: "You aren't holding that scroll." };
  }

  if (playerHasTrait('Lorekeeper', state)) {
    return {
      message: "You carefully unroll the scroll. The symbols realign into words:\n\n'❶ Do No Harm\n❷ Seek Understanding\n❸ Honour All Choice\n\nThis is the Lattice Accord — Ayla’s codebase origin.'"
    };
  } else {
    return {
      message: "The scroll’s writing twists and pulses. You cannot make sense of it..."
    };
  }
}