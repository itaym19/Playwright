import { test, expect } from "@playwright/test";
import {field, discoverElements, isValidEmail, isValidUrl} from '../modules'
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
//function to use rl.question in an sync way
function askQuestion(prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    })
}

const url = "https://test.netlify.app/";

const rl = readline.createInterface({ input, output });

test("list elements", async ({ page }) => { 
  await page.goto(url);
  const fields: field[] = await discoverElements (page,"form input, form select, form textarea, form button",);
  //Go through each field, tell the user the field type and recieve a value to fill in the field
  for (const instance: field of fields) {
    let userInput: string = '';
    switch (instance.type) {
      case 'text':
        async () => {
          userInput = await askQuestion(`Please enter your ${instance.name}: `)
        }
        break;

      case 'email':
        async () => {
          while (!isValidEmail(userInput)) {
            userInput = await askQuestion(`Please enter your ${instance.name}: `)
          }
        }
        break;
      
      case 'url':
        async () => {
          while (!isValidUrl(userInput)) {
            userInput = await askQuestion(`Please enter your ${instance.name}: `)
          }
        }
        break;
    }
  }
})

  
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

