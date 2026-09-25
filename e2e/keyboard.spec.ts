import { test, expect } from "@playwright/test";

test("keyboard: Tab reaches content, search works without mouse", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const tag = await page.evaluate(() => document.activeElement?.tagName);
  expect(tag).toBe("A");

  await page.locator('header input[aria-label="Cari judul manga"]').focus();
  await page.keyboard.type("sword");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/search\?q=sword/, { timeout: 20000 });
  await expect(page.getByText("hasil untuk")).toBeVisible({ timeout: 20000 });
});

test("keyboard: reader arrows move between pages", async ({ page }) => {
  await page.goto("/read/ch-manga-absolute-sword-sense-192", {
    waitUntil: "networkidle",
  });
  await expect(page.getByText("1 / 8").first()).toBeVisible({ timeout: 20000 });
  await page.keyboard.press("ArrowDown");
  await expect(page.getByText("2 / 8").first()).toBeVisible({ timeout: 20000 });
  await page.keyboard.press("ArrowUp");
  await expect(page.getByText("1 / 8").first()).toBeVisible({ timeout: 20000 });
});
