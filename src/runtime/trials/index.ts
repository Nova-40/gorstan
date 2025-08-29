/**
 * Gorstan Trials Runtime Modules
 * Exports all trial-specific runtime systems
 */

// Trial II: Mushroom Field Runtime
export { default as mfieldRuntime, mfield } from './mfieldRuntime';

// Trial III: Reflection Cave Runtime  
export { default as reflectRuntime, reflect } from './reflectRuntime';

// Re-export types
export type { EffectContext } from '../../content/rooms/roomTypes';
