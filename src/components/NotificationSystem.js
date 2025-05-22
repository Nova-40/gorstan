// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// NotificationSystem.js
// Simple notification system for Gorstan. Allows components to register a callback for displaying notifications.

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Efficient, readable, and concise.
     - Naming is clear and consistent.
     - No unused variables or logic.
     - Could support multiple callbacks for more flexibility (see TODO).
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
  4. 🤝 INTEGRATION CHECK
     - Can be imported and used by any component to display notifications.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - TODO: Support multiple listeners if needed (e.g., for multiple notification panels).
     - Could add unit tests for callback registration and notification delivery.
*/

/**
 * Internal callback for notification delivery.
 * @type {function|null}
 */
let callback = null;

/**
 * Registers a callback to handle notifications.
 * Only one callback is supported at a time.
 * @param {function} fn - The callback function to register.
 */
export function setNotificationCallback(fn) {
  callback = fn;
}

/**
 * Triggers a notification by calling the registered callback.
 * @param {string|object} message - The notification message or object.
 */
export function displayNotification(message) {
  if (typeof callback === "function") {
    callback(message);
  } else {
    // Defensive: log if no callback is registered
    console.warn("NotificationSystem: No callback registered for notifications.");
  }
}

// TODO: Support multiple listeners if the app grows in complexity.
// Example: Use an array of callbacks and provide add/remove methods.
