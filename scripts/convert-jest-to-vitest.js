#!/usr/bin/env node

/**
 * Jest to Vitest Conversion Script
 * Automatically converts Jest syntax to Vitest in test files
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all test files
const testFiles = glob.sync('src/**/*.{test,spec}.{ts,tsx}', {
  ignore: ['node_modules/**', 'dist/**', 'coverage/**'],
});

console.log(`Found ${testFiles.length} test files to convert`);

// Conversion patterns
const conversions = [
  // Import statements
  [/\/\/\/ <reference types=\"jest\" \/>/g, '/// <reference types="vitest" />'],
  [/import.*from ['"]jest['"];?/g, ''],

  // Jest API conversions
  [/jest\.fn\(\)/g, 'vi.fn()'],
  [/jest\.spyOn\(/g, 'vi.spyOn('],
  [/jest\.mock\(/g, 'vi.mock('],
  [/jest\.useFakeTimers\(\)/g, 'vi.useFakeTimers()'],
  [/jest\.useRealTimers\(\)/g, 'vi.useRealTimers()'],
  [/jest\.advanceTimersByTime\(/g, 'vi.advanceTimersByTime('],
  [/jest\.runAllTimers\(\)/g, 'vi.runAllTimers()'],
  [/jest\.clearAllMocks\(\)/g, 'vi.clearAllMocks()'],
  [/jest\.restoreAllMocks\(\)/g, 'vi.restoreAllMocks()'],
  [/jest\.resetAllMocks\(\)/g, 'vi.resetAllMocks()'],
];

// Process each file
testFiles.forEach((filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Apply all conversions
    conversions.forEach(([pattern, replacement]) => {
      content = content.replace(pattern, replacement);
    });

    // Add vitest imports if we made jest-related changes
    if (content !== originalContent && !content.includes("from 'vitest'")) {
      // Find existing imports and add vitest
      const importMatch = content.match(/import.*from ['"]@testing-library\/react['"];?\n/);
      if (importMatch) {
        const insertPoint = importMatch.index + importMatch[0].length;
        const vitestImport =
          "import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';\n";
        content = content.slice(0, insertPoint) + vitestImport + content.slice(insertPoint);
      } else {
        // Add at the top after existing imports
        const lines = content.split('\n');
        let insertIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ') || lines[i].startsWith('///')) {
            insertIndex = i + 1;
          } else if (lines[i].trim() === '') {
            continue;
          } else {
            break;
          }
        }
        lines.splice(
          insertIndex,
          0,
          "import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';",
        );
        content = lines.join('\n');
      }
    }

    // Write the file back if changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Converted ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
});

console.log('Jest to Vitest conversion complete!');
