import { test, expect } from "@playwright/test";

test("basic navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Bolt");
  await page.getByRole("button", { name: "or start a new chat" }).click();
  await expect(page).toHaveURL(/chat\/.+/);
});
