import puppeteer from "puppeteer";
import fs from "fs";
import { getCookies } from "./cookieManager.js";
import { runLoginFlow } from "../script/loginScript.js"; 

export const scrapeLinkedIn = async (url: string) => {
  //  Ensure cookies exist
  let cookies = getCookies();

  //  If no cookies → run login flow FIRST
  if (!cookies) {
    console.log("No cookies found. Starting login flow...");
    await runLoginFlow(); //  opens login page + saves cookies
    cookies = getCookies();
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.linkedin.com", {
    waitUntil: "domcontentloaded",
  });

  await page.setCookie(...cookies);

  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  // wait briefly for dynamic content to load
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const data = await page.evaluate(() => ({
    title: document.title,
    text: document.body.innerText,
    url: window.location.href,
  }));

  await browser.close();

  return data;
};