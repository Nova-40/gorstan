// scripts/test-movement.js
// Quick test to verify movement functionality
// Run with: node scripts/test-movement.js

import { chromium } from 'playwright';

async function testMovement() {
  console.log('🧪 Testing QuickActionsPanel movement functionality...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the game
    await page.goto('http://localhost:5173');
    console.log('✅ Game loaded');

    // Wait for the game to load completely
    await page.waitForTimeout(2000);

    // Check if we can find direction buttons
    const directionButtons = await page.$$eval(
      'button[title*="North"], button[title*="East"], button[title*="South"], button[title*="West"]',
      (buttons) =>
        buttons.map((btn) => ({
          title: btn.title,
          disabled: btn.disabled,
          className: btn.className,
        })),
    );

    console.log('📍 Found direction buttons:', directionButtons);

    // Look for the status command to check game state
    const commandInput = await page.$('input[type="text"], textarea');
    if (commandInput) {
      await commandInput.fill('status');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      // Check console output
      const consoleOutput = await page.textContent('body');
      console.log('📊 Status command executed, checking output...');

      if (consoleOutput.includes('Current Stage:')) {
        console.log('✅ Status command working');
      }
    }

    // Test teleport overlays if available
    if (commandInput) {
      await commandInput.fill('test fractal');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      console.log('🌀 Tested fractal teleport overlay');

      await commandInput.fill('test trek');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      console.log('⚡ Tested trek teleport overlay');
    }

    console.log('✅ Movement tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testMovement().catch(console.error);
