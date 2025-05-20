// Gorstan v2.2.2 – All modules validated and standardized
// InventoryPanel.jsx – Enhanced with tooltips and animation
import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
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
        {inventory.map((item, i) => (
          <motion.li key={i} whileHover={{ scale: 1.05 }} title={item.description || "No description"}>
            • {item.name || item}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
InventoryPanel.propTypes = {
  inventory: PropTypes.array.isRequired
};
