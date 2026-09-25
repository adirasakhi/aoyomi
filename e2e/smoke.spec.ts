import { test, expect } from "@playwright/test";

test("home renders sections", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Latest" })).toBeVisible({
    timeout: 20000,
  });
  await expect(page.getByRole("heading", { name: "Popular" })).toBeVisible({
    timeout: 20000,
  });
});

test("search empty state", async ({ page }) => {
  await page.goto("/search?q=judul-yang-tidak-ada-xyz", {
    waitUntil: "networkidle",
  });
  await expect(page.getByText("Komik tidak ditemukan.")).toBeVisible({
    timeout: 20000,
  });
});
