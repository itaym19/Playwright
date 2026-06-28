import { test, expect } from "@playwright/test";

type field = { name: string; type: string };

async function discoverElements(page: any, url: string): Promise<field[]> {
  await page.goto(url);
  const formFields: field[] = await page
    .locator("form input, form select, form textarea, form button")
    .evaluateAll((elements: any) => {
      return elements.map((el: any) => ({
        name: el.name,
        type: el.type,
      }));
    });
  console.log(formFields);
  return formFields;
}
test("list elements", async ({ page }) => {
  await discoverElements(page, "https://test.netlify.app/");
});
