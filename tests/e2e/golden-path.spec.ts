import { expect, test } from "@playwright/test";

// Replace with your product's golden path. It must always pass on the deployed URL.
test("add an item and see it in the list", async ({ page }) => {
  const title = `E2E item ${Date.now()}`;

  await page.goto("/example");
  await page.getByLabel("Title").fill(title);
  await page.getByRole("button", { name: "Add item" }).click();

  await expect(page.getByRole("list", { name: "Items" }).getByText(title)).toBeVisible();
});
