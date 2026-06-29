import { test, expect } from "@playwright/test";

type field = { name: string; type: string };
const url = "https://test.netlify.app/";
//function that returns array of page input fields
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
  const fields: field[] = await discoverElements(page, url);
  await page.goto(url);
  for (let i: number = 0; i < fields.length; i++) {
    if (fields[i].type === "select-one") {
      const options: string[] = await page
        .locator(`select[name ="${fields[i].name}"] option`)
        .evaluateAll((select: any) => {
          return select.map((option: any) => {
            return option.value;
          });
        });
      console.log(options);
    }
  }
});
