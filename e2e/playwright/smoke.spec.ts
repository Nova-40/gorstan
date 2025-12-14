import { test, expect } from '@playwright/test';

test('smoke: start → nexus → item → teleport → hint → save → reload', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  // This is a scaffolded test. Adjust selectors after UI modernization is implemented.
  await test.step('open', async () => {
    // Attempt to click New Game if present
    const newGameBtn = page.getByRole('button', { name: /new game/i });
    if (await newGameBtn.count()) {
      await newGameBtn.first().click();
    }
  });

  await test.step('expect nexus', async () => {
    await expect(page.getByText(/Control Nexus/i)).toBeVisible({ timeout: 10000 });
  });

  // Steps below assume UI elements will be implemented
  await test.step('pick up item', async () => {
    const pickup = page.getByRole('button', { name: /pick up/i });
    if (await pickup.count()) await pickup.first().click();
  });

  await test.step('sit teleport', async () => {
    const sit = page.getByRole('button', { name: /sit|teleport/i });
    if (await sit.count()) await sit.first().click();
  });

  await test.step('expect teleporting', async () => {
    await expect(page.getByText(/Teleporting/i)).toBeVisible({ timeout: 5000 });
  });

  await test.step('ask ayla', async () => {
    const ask = page.getByRole('button', { name: /ask Ayla/i });
    if (await ask.count()) await ask.click();
    await expect(page.getByText(/hint|try|consider/i)).toBeVisible({ timeout: 5000 });
  });

  await test.step('save', async () => {
    const save = page.getByRole('button', { name: /save/i });
    if (await save.count()) await save.click();
    await page.reload();
    await expect(page.getByText(/saved game loaded/i)).toBeVisible({ timeout: 5000 });
  });
});
