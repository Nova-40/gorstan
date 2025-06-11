// Gorstan Game Module — v3.0.0
// Gorstan Game Module — v3.0.0
// MIT License © 2025 Geoff Webster
// eventBus.js — Simple publish/subscribe system for decoupled modules

/**
 * Internal registry of event subscribers.
 * @type {Object.<string, Array<function>>}
 */
const subscribers = {};

/**
 * Subscribes a callback to a named event.
 * @param {string} event - The event name to subscribe to.
 * @param {function} callback - The callback to invoke when the event is emitted.
 */
export const subscribe = (event, callback) => {
  if (typeof event !== "string" || typeof callback !== "function") {
    // Defensive: Invalid arguments
    // eslint-disable-next-line no-console
    console.error("eventBus.subscribe: Invalid event or callback.");
    return;
  }
  if (!subscribers[event]) {
    subscribers[event] = [];
  }
  subscribers[event].push(callback);
};

/**
 * Emits an event, calling all subscribed callbacks with the provided data.
 * @param {string} event - The event name to emit.
 * @param {*} data - Data to pass to each subscriber callback.
 */
export const emit = (event, data) => {
  if (typeof event !== "string") {
    // Defensive: Invalid event name
    // eslint-disable-next-line no-console
    console.error("eventBus.emit: Event name must be a string.");
    return;
  }
  if (subscribers[event]) {
    // Defensive: Wrap each callback in try/catch to avoid breaking the loop
    subscribers[event].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`eventBus.emit: Error in subscriber for event '${event}':`, err);
      }
    });
  }
};

/**
 * Lists all event names with at least one subscriber.
 * @returns {string[]} Array of event names.
 */
export const listSubscribers = () => Object.keys(subscribers);

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ JSDoc comments for all functions, parameters, and returns.
- ✅ Defensive error handling for invalid arguments and subscriber errors.
- ✅ No dead code or unused imports.
- ✅ Structure is modular and ready for integration.
- 🧪 TODO: Add unsubscribe functionality for more robust event management.
*/