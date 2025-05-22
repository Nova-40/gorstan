// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// InventoryPanel.jsx
// Animated inventory panel for Gorstan, with tooltips and error handling.

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Uses modern React patterns (function component, arrow function).
     - Efficient and readable; no unused variables.
     - Naming is clear and consistent.
     - Defensive error handling for invalid inventory data.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
     - PropTypes for all props.
  4. 🤝 INTEGRATION CHECK
     - Expects `inventory` prop (array) from parent (Game or similar).
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could extract error logging to a utility if used elsewhere.
     - Could add unit tests for rendering and error handling.
     - Could memoize for large inventories, but not needed for typical use.
*/

import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

/**
 * InventoryPanel Component
 * Displays the player's inventory with animation and tooltips.
 *
 * @param {Object} props
 * @param {Array} props.inventory - The inventory array (can be strings or objects with name/description).
 */
export default function InventoryPanel({ inventory }) {
  if (!Array.isArray(inventory)) {
    console.error("❌ InventoryPanel: Invalid inventory data.");
    return (
      <div className="border border-red-700 p-4 rounded shadow-md bg-gray-900">
        <div className="font-bold text-red-500">Error</div>
        <p className="text-gray-400 text-sm">Failed to load inventory.</p>
      </div>
    );
  }
  return (
    <div className="p-2 border border-green-600 rounded-md bg-black text-green-300">
      <h2 className="text-lg font-bold mb-2">Inventory</h2>
      <ul>
        {inventory.length === 0 && (
          <li className="text-gray-500 italic">Your pockets are empty.</li>
        )}
        {inventory.map((item, i) => (
          <motion.li
            key={item.id || item.name || item.toString() || i}
            whileHover={{ scale: 1.05 }}
            title={typeof item === "object" && item.description ? item.description : "No description"}
            className="cursor-help"
          >
            • {typeof item === "object" && item.name ? item.name : item}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

InventoryPanel.propTypes = {
  inventory: PropTypes.array.isRequired,
};
