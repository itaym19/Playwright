import { test, expect } from "@playwright/test";
import { field, discoverElements, isValidEmail, isValidUrl } from "../modules";
import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

//function to use rl.question in an sync way
function askQuestion(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

const url = "https://test.netlify.app/";

const rl = readline.createInterface({ input, output });

test("list elements", async ({ page }) => {
  await page.goto(url);
  const fields: field[] = await discoverElements(page, "form input, form select, form textarea, form button");
  //Go through each field, tell the user the field type and recieve a value to fill in the field
  for (const instance of fields) {
    let userInput: string = "";
    switch (instance.type) {
      case "text":
        userInput = await askQuestion(`Please enter your ${instance.name}: `);
        break;

      case "email":
        while (!isValidEmail(userInput)) {
          userInput = await askQuestion(`Please enter your ${instance.name}: `);
        }
        break;

      case "url":
        while (!isValidUrl(userInput)) {
          userInput = await askQuestion(`Please enter your ${instance.name}: `);
        }
        break;

      case "select-one":
        const options: string[] = await page.locator(`select[name = ${instance.name}]`).evaluateAll((options) => options.map((option: any) => option.value));
        while (!(userInput in options)) {
          userInput = await askQuestion(`select number of employees: ${options.join(", ")}`);
        }
        break;

      case "submit":
        page.locator('button[type="submit"]').click();
        console.log(`form was submitted`);
        break;

      default:
        console.log("not a valid input type");
        break;
    }
  }
});

/*  for (let i: number = 0; i < fields.length; i++) {
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
  } */
