import fs from "node:fs";
import puppeteer from "puppeteer";
import sharp from "sharp";
import moment from "moment";
import { getFolderSystem } from "./setting";
import { startProfile, stopProfile, wait } from "./runProfile";
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
    await wait(60);

    await page.keyboard.press('Escape');
    await wait(2);
    await page.keyboard.press('Escape');
    await wait(2);
    await page.keyboard.press('Escape');
    await wait(2);
    await page.keyboard.press('Escape');
    await wait(2);

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

    const fileName = `${profileId}.${moment().format('YYYY-MM-DD_HH-mm-ss')}.jpeg`

    // resize screenshot
    const resizedScreenshot = await sharp(screenshot as Buffer)
      .jpeg({ quality: 80 })
      .toBuffer();

    // check duplicate profile id if exist, delete it
    const files = fs.readdirSync(folderSystem.screenshots)
    const duplicateFiles = files.filter((file) => file.split('.')[0] === profileId)
    if (duplicateFiles.length > 0) {
      duplicateFiles.forEach((file) => fs.unlinkSync(`${folderSystem.screenshots}/${file}`))
    }

    fs.writeFileSync(`${folderSystem.screenshots}/${fileName}`, resizedScreenshot);

    await page.close();

    await stopProfile(profileId);
    sendToRenderer('profile-status', { profileId, message: 'Scan analytics success ✅' });
  } catch (error) {
    sendToRenderer('profile-status', { profileId, message: error });
    await stopProfile(profileId);
  }
}

export const getAnalytics = async () => {
  const folderSystem = getFolderSystem()
  const files = fs.readdirSync(folderSystem.screenshots)
  const analytics: Analytics[] = files.map((file) => {
    const profileId = file.split('.')[0]
    const lastUpdate = file.split('.')[1]
    const fileType = file.split('.')[2]
    const screenshot = fs.readFileSync(`${folderSystem.screenshots}/${file}`)
    return { profile_id: profileId, screenshot: screenshot.toString('base64'), file_type: fileType, last_update: lastUpdate }
  })

  return filter(analytics, (analytics) => analytics.file_type === 'jpeg')

}
