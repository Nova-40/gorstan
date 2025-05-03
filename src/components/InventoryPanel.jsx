import React from "react";
import PropTypes from "prop-types";

/**
 * InventoryPanel Component
 * This component displays the player's inventory, showing a list of items with optional descriptions.
 * It handles empty states gracefully and ensures proper rendering of inventory items.
 *
 * Props:
 * - inventory: An array of inventory items, where each item is an object with a `name` and optional `description`.
 */
export default function InventoryPanel({ inventory }) {
  try {
    // Validate inventory data
    if (!Array.isArray(inventory)) {
      throw new Error("Invalid inventory data. Please provide an array of items.");
    }

    return (
      <div className="border border-green-700 p-4 rounded shadow-md bg-gray-900">
        {/* Inventory Title */}
        <div className="font-bold mb-2 text-green-300 text-lg">Inventory</div>

        {/* Inventory Items */}
        <ul className="list-disc list-inside text-sm text-green-400">
          {inventory.length > 0 ? (
            inventory.map((item, i) => (
              <li key={i} className="mb-2">
                <span className="font-semibold">{item.name || item}</span>
                {item.description && (
                  <p className="text-gray-400 text-xs mt-1">{item.description}</p>
                )}
              </li>
            ))
          ) : (
            <li className="text-gray-500">(Your inventory is empty)</li>
          )}
        </ul>
      </div>
    );
  } catch (err) {
    console.error("❌ Error rendering InventoryPanel:", err);
    return (
      <div className="border border-red-700 p-4 rounded shadow-md bg-gray-900">
        <div className="font-bold text-red-500">Error</div>
        <p className="text-gray-400 text-sm">Failed to load your inventory. Please try again later.</p>
      </div>
    );
  }
}

// PropTypes for type-checking
InventoryPanel.propTypes = {
  inventory: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired, // The name of the inventory item
      description: PropTypes.string, // Optional description for the inventory item
    })
  ).isRequired,
};
