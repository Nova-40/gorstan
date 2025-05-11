// validateRooms.js
// Run this with Node to check room configuration consistency for the Gorstan game.

// MIT License
// Copyright (c) 2025 Geoff Webster
// Gorstan v2.1.0

import { rooms } from "./rooms.js";

console.log("🔍 Validating room configuration...\n");

let totalIssues = 0;

for (const [roomId, room] of Object.entries(rooms)) {
  const issues = [];

  // Check for missing or empty description
  if (!room.description || room.description.trim() === "") {
    issues.push("⚠️ Missing description");
  }

  // Check for missing or empty exits
  if (!room.exits || (typeof room.exits === "object" && Object.keys(room.exits).length === 0)) {
    issues.push("⚠️ Missing or empty exits");
  }

  // Check dynamic exits (if exits is a function)
  if (typeof room.exits === "function") {
    try {
      const exitsResult = room.exits({ storyFlags: new Set() });
      if (!exitsResult || Object.keys(exitsResult).length === 0) {
        issues.push("⚠️ Dynamic exits returned nothing");
      }
    } catch (err) {
      issues.push(`❌ Error in dynamic exits function: ${err.message}`);
    }
  }

  // Check for missing or invalid image
  if (!room.image || typeof room.image !== "string" || room.image.trim() === "") {
    issues.push("⚠️ Missing or invalid image");
  }

  // Check for onEnter function errors
  if (room.onEnter && typeof room.onEnter !== "function") {
    issues.push("⚠️ onEnter is not a function");
  }

  // Log issues for the room
  if (issues.length > 0) {
    console.log(`Room "${roomId}":`);
    issues.forEach((msg) => console.log("  - " + msg));
    totalIssues += issues.length;
  }
}

if (totalIssues > 0) {
  console.log(`\n❌ Validation complete. Found ${totalIssues} issue(s) across rooms.`);
} else {
  console.log("\n✅ Validation complete. All rooms are properly configured.");
}