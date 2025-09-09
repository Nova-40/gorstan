import { RoomFXSpec } from './AnimatedBackdrop';

const base = import.meta.env.BASE_URL ?? '/';
const img = (name: string) => `${base}images/rooms/${name}`;

// Control Nexus - High-tech control room with blinking indicators and data streams
export const controlNexusFX: RoomFXSpec = {
  baseImage: img('control-nexus.png'),
  layers: [
    {
      type: 'blink-led',
      id: 'status-led-1',
      color: '#00ff00',
      interval: 1500,
      position: { top: '20%', left: '15%' },
      size: { width: '6px', height: '6px' },
    },
    {
      type: 'blink-led',
      id: 'status-led-2',
      color: '#ff6600',
      interval: 2000,
      position: { top: '25%', right: '20%' },
      size: { width: '8px', height: '8px' },
    },
    {
      type: 'crt-scroller',
      id: 'data-stream',
      text: 'SYSTEM_STATUS_NOMINAL_DATA_STREAM_ACTIVE',
      color: '#00ff88',
      speed: 100,
      opacity: 0.3,
      position: { bottom: '10%', left: '10%' },
      size: { width: '200px', height: '60px' },
    },
    {
      type: 'static-overlay',
      id: 'interference',
      pattern: 'lines',
      opacity: 0.05,
    },
  ],
};

// Burger Joint - Cozy diner with warm lighting and floating steam
export const burgerJointFX: RoomFXSpec = {
  baseImage: img('burger-joint.png'),
  layers: [
    {
      type: 'floating-orb',
      id: 'steam-1',
      color: '#ffffff',
      orbSize: 12,
      speed: 0.5,
      opacity: 0.3,
      position: { top: '30%', left: '60%' },
    },
    {
      type: 'floating-orb',
      id: 'steam-2',
      color: '#f0f0f0',
      orbSize: 8,
      speed: 0.7,
      opacity: 0.25,
      position: { top: '35%', left: '65%' },
    },
    {
      type: 'blink-led',
      id: 'neon-sign',
      color: '#ff3366',
      interval: 3000,
      position: { top: '10%', left: '50%' },
      size: { width: '4px', height: '4px' },
    },
    {
      type: 'particles',
      id: 'ambient-sparkles',
      count: 8,
      color: '#ffaa44',
      speed: 0.3,
      particleSize: 1,
      opacity: 0.4,
    },
  ],
};

// Cafe - Relaxing coffee shop with subtle ambient effects
export const cafeFX: RoomFXSpec = {
  baseImage: img('cafe.png'),
  layers: [
    {
      type: 'floating-orb',
      id: 'coffee-steam',
      color: '#e6d3b7',
      orbSize: 10,
      speed: 0.4,
      opacity: 0.2,
      position: { top: '40%', left: '70%' },
    },
    {
      type: 'static-overlay',
      id: 'ambient-texture',
      pattern: 'dots',
      opacity: 0.03,
    },
    {
      type: 'particles',
      id: 'dust-motes',
      count: 12,
      color: '#f4e6d3',
      speed: 0.2,
      particleSize: 1,
      opacity: 0.3,
    },
    {
      type: 'blink-led',
      id: 'espresso-light',
      color: '#44aa88',
      interval: 4000,
      position: { top: '50%', right: '25%' },
      size: { width: '3px', height: '3px' },
    },
  ],
};

// Hub - Central area with dynamic energy flows
export const hubFX: RoomFXSpec = {
  baseImage: img('hub.png'),
  layers: [
    {
      type: 'particles',
      id: 'energy-flow',
      count: 15,
      color: '#00aaff',
      speed: 0.8,
      particleSize: 2,
      opacity: 0.5,
    },
    {
      type: 'floating-orb',
      id: 'core-energy-1',
      color: '#0088ff',
      orbSize: 16,
      speed: 0.6,
      opacity: 0.4,
      position: { top: '30%', left: '40%' },
    },
    {
      type: 'floating-orb',
      id: 'core-energy-2',
      color: '#4400ff',
      orbSize: 12,
      speed: 0.8,
      opacity: 0.3,
      position: { top: '60%', right: '30%' },
    },
    {
      type: 'crt-scroller',
      id: 'hub-status',
      text: 'HUB_OPERATIONAL_CONNECTIONS_STABLE',
      color: '#00ccff',
      speed: 80,
      opacity: 0.25,
      position: { top: '5%', right: '5%' },
      size: { width: '180px', height: '40px' },
    },
    {
      type: 'static-overlay',
      id: 'energy-grid',
      pattern: 'grid',
      opacity: 0.08,
    },
  ],
};

// Export a map for convenience
export const builtinFxByRoomId: Record<string, RoomFXSpec | null> = {
  ControlNexus: controlNexusFX,
  BurgerJoint: burgerJointFX,
  Cafe: cafeFX,
  Hub: hubFX,
};
