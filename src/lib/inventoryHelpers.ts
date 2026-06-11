// Inventory helpers extracted so their logic can be unit-tested.
import { CAFE_ROOM_ID } from '../constants/roomIds';

export function addItemToInventoryState(prev: any, itemId: string) {
  const messages: string[] = [];
  if (prev.inventory && prev.inventory.includes(itemId)) {
    messages.push('You already have that.');
    return { state: prev, messages };
  }

  let layerState = prev.layerState;
  if (itemId === 'remote_control_device') {
    // signal layer event — keep minimal
    if (layerState && typeof layerState === 'object') layerState = Object.assign({}, layerState, { lastEvent: 'picked_up_remote' });
  }

  if (itemId === 'schrodinger_coin') {
    const flags = Object.assign({}, prev.flags, { schrodinger_coin_collapsed: true });
    messages.push("You pick up the coin. It instantly becomes the least interesting object you own, but you have an uneasy feeling you've just collapsed something you shouldn't have.");
    const next = { ...prev, inventory: [...(prev.inventory || []), itemId], layerState, flags };
    return { state: next, messages };
  }

  if (itemId === 'redacted_register') {
    messages.push("You lift the heavy ledger. Every time you look at a page, different names are missing. Whatever keeps this list up to date is still watching the world.");
    const flags = Object.assign({}, prev.flags, { register_acquired: true });
    const next = { ...prev, inventory: [...(prev.inventory || []), itemId], layerState: prev.layerState, flags };
    return { state: next, messages };
  }

  if (itemId === 'mysterious_napkin') {
    messages.push("You carefully fold the stained napkin and pocket it. It feels like evidence for a crime that hasn't happened yet.");
  } else {
    messages.push(`You pick up: ${itemId}.`);
  }

  const next = { ...prev, inventory: [...(prev.inventory || []), itemId], layerState: layerState };
  return { state: next, messages };
}

export function dropItemFromInventoryState(prev: any, itemId: string) {
  const messages: string[] = [];
  if (!prev.inventory || !prev.inventory.includes(itemId)) {
    messages.push('You are not carrying that.');
    return { state: prev, messages };
  }

  if (itemId === 'schrodinger_coin') {
    if (prev.currentRoomId !== CAFE_ROOM_ID) {
      messages.push('You reach for the coin, but your pockets are inexplicably empty. It refuses to exist anywhere except on the café tiles.');
      return { state: prev, messages };
    }
    const newInv = (prev.inventory || []).filter((i: string) => i !== itemId);
    messages.push('You set the coin back down exactly on the grout line between two tiles. For a moment you are not entirely sure you ever picked it up.');
    const next = { ...prev, inventory: newInv };
    return { state: next, messages };
  }

  const newInv = (prev.inventory || []).filter((i: string) => i !== itemId);
  messages.push(`You drop: ${itemId}.`);
  const next = { ...prev, inventory: newInv };
  return { state: next, messages };
}
