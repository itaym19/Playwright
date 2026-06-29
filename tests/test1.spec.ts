import { test, expect } from "@playwright/test";
import {field, discoverElements, isValidEmail} from '../modules'
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const url = "https://test.netlify.app/";

const rl = readline.createInterface({ input, output });

test("list elements", async ({ page }) => {
  await page.goto(url);
  const fields: field[] = await discoverElements (page,"form input, form select, form textarea, form button",);
  //Go through each field, tell the user the field type and recieve a value to fill in the field
  for (const instance: field of fields) {
    switch (instance.type) {
      case 'text':
        rl.question(`Please enter your ${instance.name}:` , async (answer: string ) => {
          await page.locator(`form [name = ${instance.name}] input`).fill(answer);
          console.log(`You have entered: ${answer}`);
          rl.close();
        })
        break;

      case 'email':
        rl.question(`Please enter your ${instance.name}:` , async (answer: string ) => {
          async function askEmail() {
            if (!isValidEmail(answer)) {
              console.log('Invalid email. Please try again.');
              return askEmail(); // ask again
            }
          }
          await page.locator(`form [name = ${instance.name}] input`).fill(answer);
          console.log(`You have entered: ${answer}`);
          rl.close();
        })
        break;
      
      case 'url':
        const rl = readline.createInterface({ input, output });
        rl.question(`Please enter your ${field.name}:` , async (answer: string ) => {
          await page.locator(`form [name = ${field.name}] input`).fill(answer);
          console.log(`You have entered: ${answer}`);
          rl.close();
        })
        break;
    }
  })
  
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
