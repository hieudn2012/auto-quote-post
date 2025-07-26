import fs from "node:fs";
import puppeteer from "puppeteer";
import sharp from "sharp";
import { getFolderSystem } from "./setting";
import { ErrorMessage, startProfile, stopProfile, wait } from "./runProfile";
import { writeBrowser } from "./writeLog";
import { Analytics } from "@/types/window";
import { sendToRenderer } from "./main";
import { filter } from "lodash";

const WIDTH = 600
const HEIGHT = 600

export const captureAnalytics = async (profileId: string) => {
  try {
    const { data } = await startProfile(profileId);
    const wsUrl = data.wsUrl;

    writeBrowser({ profileId, wsUrl });

    const browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl
    });

    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT });
    await page.goto(`https://www.threads.com/insights/views?days=7`);
    await wait(15);
    await page.keyboard.press('Escape');
    await wait(5);

    const screenshot = await page.screenshot({
      fullPage: false,
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT,
      },
    });

    // save screenshot to folder
    const folderSystem = getFolderSystem()

    // resize screenshot
    const resizedScreenshot = await sharp(screenshot as Buffer)
      .jpeg({ quality: 80 })
      .toBuffer();
    fs.writeFileSync(`${folderSystem.screenshots}/${profileId}.jpeg`, resizedScreenshot);

    await browser.close();
    sendToRenderer('profile-status', { profileId, message: 'Scan analytics success ✅' });
  } catch (error) {
    console.log(error, 'error');
    sendToRenderer('profile-status', { profileId, message: ErrorMessage.ANALYTICS_ERROR });
    await stopProfile(profileId);
  }
}

export const getAnalytics = async () => {
  const folderSystem = getFolderSystem()
  const files = fs.readdirSync(folderSystem.screenshots)
  const analytics: Analytics[] = files.map((file) => {
    const profileId = file.split('.')[0]
    const fileType = file.split('.')[1]
    const screenshot = fs.readFileSync(`${folderSystem.screenshots}/${file}`)
    return { profile_id: profileId, screenshot: screenshot.toString('base64'), file_type: fileType }
  })

  return filter(analytics, (analytics) => analytics.file_type === 'jpeg')

}
