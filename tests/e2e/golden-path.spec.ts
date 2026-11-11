import { expect, test } from "@playwright/test";

// Golden path: open home, submit a report, see it in the list. Must always pass on the deployed URL.
test("submit a report and see it in the list", async ({ page }) => {
  const description = `E2E report ${Date.now()}`;

  await page.goto("/");
  await expect(page.getByTestId("report-count")).not.toHaveText("...");
  const countBefore = Number(await page.getByTestId("report-count").innerText());

  await page.getByLabel("What is wrong?").fill(description);
  await page.getByRole("button", { name: "Submit report" }).click();

  await expect(page.getByRole("list", { name: "Reports" }).getByText(description)).toBeVisible();
  await expect(page.getByTestId("report-count")).toHaveText(String(countBefore + 1));
});
