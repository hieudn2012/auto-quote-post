import fs from "node:fs";
import puppeteer from "puppeteer";
import sharp from "sharp";
import { getFolderSystem } from "./setting";
import { startProfile, wait } from "./runProfile";
import { writeBrowser } from "./writeLog";

export const captureAnalytics = async (profileId: string) => {
  const { data } = await startProfile(profileId);
  const wsUrl = data.wsUrl;

  writeBrowser({ profileId, wsUrl });

  const browser = await puppeteer.connect({
    browserWSEndpoint: wsUrl
  });

  const page = await browser.newPage();
  await page.goto(`https://www.threads.com/insights/views?days=7`);
  await wait(10);

  const divClass = `xz401s1 x195bbgf xgb0k9h x1l19134 xgjo3nb xgrrwr1 x7o7tq0 x1rs6hn2 xvb4t3y x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu xt8cgyo x128c8uf x1co6499 xc5fred x1ma7e2m x2huve6 x1q8hl3c x12w1swl x1x44skv`;
  await wait(20);
  await page.keyboard.press('Escape');
  await wait(5);
  const content = await page.$(`div[class*="${divClass}"]`);
  // capture content
  const screenshot = await content?.screenshot();

  // save screenshot to folder
  const folderSystem = getFolderSystem()

  // resize screenshot
  const resizedScreenshot = await sharp(screenshot as Buffer)
    .resize({
      width: 600,
      height: 400,
    })
    .jpeg({ quality: 80 })
    .toBuffer();
  fs.writeFileSync(`${folderSystem.screenshots}/${profileId}.jpeg`, resizedScreenshot);

  await browser.close();
}
