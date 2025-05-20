// Gorstan v2.2.2 – All modules validated and standardized
// useInventory.js
// Custom React hook for managing the Gorstan inventory using localStorage.
// Handles all inventory item operations robustly and defensively.
// Version 2.2.0
// MIT License
// Copyright (c) 2025 Geoff Webster
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
      console.warn("⚠️ Could not parse inventory:", err);
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
      console.warn("⚠️ Could not save inventory:", err);
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
/*
  === Change Commentary ===
  - Updated version to 2.2.0 and ensured MIT license is present.
  - Defensive: Added type checks for all item operations.
  - Used Set in addItem to guarantee uniqueness.
  - All syntax validated and ready for use in the Gorstan game.
  - Comments improved for maintainability and clarity.
*/
