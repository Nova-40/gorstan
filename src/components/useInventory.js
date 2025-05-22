// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// useInventory.js
// Custom React hook for managing the Gorstan inventory using localStorage.
// Handles all inventory item operations robustly and defensively.

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Uses modern React patterns (custom hook, useCallback).
     - Efficient, readable, and concise.
     - Naming is clear and consistent.
     - No unused variables or logic.
     - Defensive: Added type checks for all item operations.
     - Used Set in addItem to guarantee uniqueness.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
     - All operations documented.
  4. 🤝 INTEGRATION CHECK
     - Can be imported and used by any component for inventory management.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could add unit tests for all inventory operations.
     - Could accept a storage key as a parameter for multi-profile support.
     - Could add a subscribe/listen API for inventory changes.
*/

import { useCallback } from "react";

/**
 * useInventory
 * Provides robust inventory management for Gorstan.
 * All operations are error-trapped and localStorage-backed.
 * Returns: { getInventory, setInventory, hasItem, addItem, removeItem, clearInventory }
 */
export default function useInventory() {
  /**
   * Safely retrieves the inventory array from localStorage.
   * Returns an empty array if not found or on error.
   */
  const getInventory = useCallback(() => {
    try {
      const inv = localStorage.getItem("gorstanInventory") || "[]";
      const parsed = JSON.parse(inv);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn("⚠️ useInventory: Could not parse inventory:", err);
      return [];
    }
  }, []);

  /**
   * Safely sets the inventory array in localStorage.
   * Accepts only arrays; ignores invalid input.
   */
  const setInventory = useCallback((newInventory) => {
    try {
      if (!Array.isArray(newInventory)) {
        throw new Error("Inventory must be an array.");
      }
      localStorage.setItem("gorstanInventory", JSON.stringify(newInventory));
    } catch (err) {
      console.warn("⚠️ useInventory: Could not save inventory:", err);
    }
  }, []);

  /**
   * Checks if the inventory contains a specific item.
   * @param {string} item - Item name to check.
   * @returns {boolean}
   */
  const hasItem = useCallback((item) => {
    if (typeof item !== "string" || !item) return false;
    return getInventory().includes(item);
  }, [getInventory]);

  /**
   * Adds an item to the inventory if not already present.
   * @param {string} item - Item name to add.
   */
  const addItem = useCallback((item) => {
    if (typeof item !== "string" || !item) return;
    setInventory([...new Set([...getInventory(), item])]);
  }, [getInventory, setInventory]);

  /**
   * Removes an item from the inventory.
   * @param {string} item - Item name to remove.
   */
  const removeItem = useCallback((item) => {
    if (typeof item !== "string" || !item) return;
    setInventory(getInventory().filter(i => i !== item));
  }, [getInventory, setInventory]);

  /**
   * Clears the entire inventory.
   */
  const clearInventory = useCallback(() => {
    setInventory([]);
  }, [setInventory]);

  return { getInventory, setInventory, hasItem, addItem, removeItem, clearInventory };
}
