export type field = { name: string; type: string };

//function that returns array of page input fields
export async function discoverElements (page: any,...searchedFields: string[]): Promise<field[]> {
  const formFields: field[] = await page
    .locator(searchedFields.join(", "))
    .evaluateAll((elements: any) => {
      return elements.map((el: any) => ({
        name: el.name,
        type: el.type,
      }));
    });
  console.log(formFields);
  return formFields;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

