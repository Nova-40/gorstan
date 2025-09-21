// Simple demo running state helper (in-memory)
let _running = false;
export const setDemoRunning = (v: boolean) => { _running = v; };
export const isDemoRunning = () => _running;
