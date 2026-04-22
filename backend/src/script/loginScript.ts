import { addExtra } from "puppeteer-extra";
import puppeteer from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";

const puppeteerExtra = addExtra(puppeteer as any);
puppeteerExtra.use(StealthPlugin());

const chromePath = process.env.CHROME_PATH;

if (!chromePath) {
  throw new Error("CHROME_PATH is not defined");
}

export const runLoginFlow = async () => {
  const browser = await puppeteerExtra.launch({
    headless: false,
    executablePath: chromePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=500,700",
      "--app=https://www.linkedin.com/login",
    ],
    defaultViewport: { width: 500, height: 700 },
  });

  const page = (await browser.pages())[0]!;

  await page.goto("https://www.linkedin.com/login", {
    waitUntil: "domcontentloaded",
  });

  console.log("👉 Login manually now...");

  await page.waitForFunction(() => !location.href.includes("/login"), {
    timeout: 0,
  });

  const cookies = await page.cookies();
  fs.writeFileSync("cookies.json", JSON.stringify(cookies, null, 2));

  console.log("Cookies saved");

  await browser.close();
};