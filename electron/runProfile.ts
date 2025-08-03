import puppeteer from 'puppeteer-core';
import { writeBrowser, getBrowser, writeHistory } from "./writeLog";
import { each, get } from "lodash";
import { sendToRenderer } from "./main";
import { getSettings, getSettingByProfileId } from "./setting";
import axios from "axios";
import { screen, BrowserWindow } from 'electron';

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms * 1000));

enum Message {
  START_PROFILE = 'Start profile',
  STOP_PROFILE = 'Stop profile',
  CLICK_REPOST = 'Click repost',
  CLICK_QUOTE = 'Click quote',
  UPLOAD_IMAGE = 'Upload image',
  CLICK_COMMENT_INPUT = 'Click comment input',
  CLICK_POST = 'Click post',
  DONE = 'Done! 🎉',
  ERROR = 'Error: ',
  MAX_RETRIES = 'Max retries reached (5), stopping...',
  NETWORK_ERROR = 'Network error, change port...',
  CLOSE_PAGES = 'Close pages',
  URL_NOT_FOUND = 'Url not found OR your has been run all urls successfully',
  START_POST = 'Start post',
  OPEN_HOME_PAGE = 'Open home page',
}

export enum ErrorMessage {
  CONNECT_ECONNREFUSED = 'connect ECONNREFUSED',
  NAVIGATION_TIMEOUT = 'Navigation timeout',
  POST_NOT_FOUND = 'Post not found',
  COMMENT_INPUT_NOT_FOUND = 'Comment input not found',
  INPUT_FILE_NOT_FOUND = 'Input file not found',
  REPOST_BUTTON_NOT_FOUND = 'Repost button not found',
  QUOTE_BUTTON_NOT_FOUND = 'Quote button not found',
  UPLOAD_IMAGE_ERROR = 'Upload image error',
  CLOSE_PAGES_ERROR = 'Close pages error',
  UNKNOWN_ERROR = 'Unknown error',
  URL_NOT_FOUND = 'Url not found OR your has been run all urls successfully',
  ANALYTICS_ERROR = 'Analytics error',
  NOT_FOUND_POST_BUTTON = 'Not found post button',
  NOT_FOUND_STATUS_INPUT = 'Not found status input',
  NOT_FOUND_CAPTION_OR_FILES = 'Not found caption or files',
}

const changePort = async ({ profileId }: { profileId: string }) => {
  const setting = getSettingByProfileId(profileId)
  const proxy = setting.proxy

  sendToRenderer('profile-status', { profileId, message: `Change port to ${proxy?.port}` });
  const data = {
    host: proxy?.host,
    mode: proxy?.mode,
    username: proxy?.username,
    password: proxy?.password,
    port: proxy?.port,
  }

  const settings = getSettings()

  return axios.patch(`https://api.gologin.com/browser/${profileId}/proxy`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.token}`
    }
  })
}

export const startProfile = async (profileId: string) => {
  sendToRenderer('profile-status', { profileId, message: Message.START_PROFILE });

  // Get the current screen position where the Electron app is running
  const primaryDisplay = screen.getPrimaryDisplay();
  const displays = screen.getAllDisplays();

  // Find the display where the main window is located
  const mainWindow = (global as any).mainWindow as BrowserWindow | null; // Access global mainWindow
  let targetDisplay = primaryDisplay;

  if (mainWindow) {
    const windowBounds = mainWindow.getBounds();
    const windowCenter = {
      x: windowBounds.x + windowBounds.width / 2,
      y: windowBounds.y + windowBounds.height / 2
    };

    // Find which display contains the window center
    targetDisplay = displays.find((display: Electron.Display) => {
      const bounds = display.bounds;
      return windowCenter.x >= bounds.x &&
        windowCenter.x <= bounds.x + bounds.width &&
        windowCenter.y >= bounds.y &&
        windowCenter.y <= bounds.y + bounds.height;
    }) || primaryDisplay;
  }

  return axios.post('http://localhost:36912/browser/start-profile', {
    profileId,
    sync: true,
    // Add screen position configuration
    screen: {
      x: targetDisplay.bounds.x,
      y: targetDisplay.bounds.y,
      width: targetDisplay.bounds.width,
      height: targetDisplay.bounds.height
    }
  })
}

export const stopProfile = async (profileId: string) => {
  return axios.post('http://localhost:36912/browser/stop-profile', {
    profileId
  })
}

export const runProfile = async (profileId: string, retryCount: number = 0) => {
  try {
    const { data } = await startProfile(profileId);
    const wsUrl = data.wsUrl;

    writeBrowser({ profileId, wsUrl });

    await sharePost({ profileId });

  } catch (error) {
    const message = get(error, 'message', ErrorMessage.UNKNOWN_ERROR);
    if (message.includes(ErrorMessage.URL_NOT_FOUND)) {
      sendToRenderer('profile-status', { profileId, message: Message.URL_NOT_FOUND });
      return;
    }

    if (retryCount >= 5) {
      sendToRenderer('profile-status', { profileId, message: Message.MAX_RETRIES });
      return;
    }
    await changePort({ profileId });
    await wait(2);
    await runProfile(profileId, retryCount + 1);
  }
}

export const sharePost = async ({ profileId }: { profileId: string }, retryCount: number = 0) => {
  try {
    const setting = getSettingByProfileId(profileId);
    const settings = getSettings();
    const postUrl = setting.url || '';

    if (!postUrl) {
      await stopProfile(profileId);
      await wait(2);
      sendToRenderer('profile-status', { profileId, message: Message.DONE });
      return;
    }

    const randomCaptionId = setting?.caption_ids?.[Math.floor(Math.random() * setting?.caption_ids.length)];
    const randomCaption = settings.captions.find(caption => caption.id === randomCaptionId)?.caption || '';

    const wsUrl = getBrowser(profileId);
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl
    });

    // browser reset pages to 1
    await browser.pages().then(pages => {
      pages.forEach(page => page.close());
    });

    const page = await browser.newPage();

    const views = {
      small: {
        width: 1366,
        height: 768
      },
      medium: {
        width: 1920,
        height: 1080
      },
      large: {
        width: 1440,
        height: 900
      }
    }

    type ViewKey = keyof typeof views;
    const randomView = views[Object.keys(views)[Math.floor(Math.random() * Object.keys(views).length)] as ViewKey];
    await page.setViewport(randomView);
    await page.goto(postUrl);
    await wait(10);

    // Escape to close all popup
    await page.keyboard.press('Escape');
    await wait(3);

    // find svg with aria-label="Repost"
    const svg = await page.$('svg[aria-label="Repost"]');
    await wait(3);
    if (!svg) {
      throw new Error(ErrorMessage.REPOST_BUTTON_NOT_FOUND);
    }
    await svg?.click();
    sendToRenderer('profile-status', { profileId, message: Message.CLICK_REPOST });
    console.log('click repost');
    await wait(5);

    // find svg with aria-label = Quote 
    const svgQuote = await page.$('svg[aria-label="Quote"]');
    await wait(3);
    if (!svgQuote) {
      throw new Error(ErrorMessage.QUOTE_BUTTON_NOT_FOUND);
    }
    await svgQuote?.click();
    sendToRenderer('profile-status', { profileId, message: Message.CLICK_QUOTE });
    console.log('click quote');
    await wait(3);
    // find input with type = file
    const input = await page.$('input[type="file"]');
    await wait(3);
    if (!input) {
      throw new Error(ErrorMessage.INPUT_FILE_NOT_FOUND);
    }

    console.log('input found');
    const images = setting.files;
    each(images, async (image) => {
      await input?.uploadFile(image);
      sendToRenderer('profile-status', { profileId, message: `Upload image ${image}` });
      console.log(`upload image ${image}`);
      await wait(5);
    });


    sendToRenderer('profile-status', { profileId, message: Message.UPLOAD_IMAGE });
    console.log('upload image');
    await wait(5);

    // find div with aria-label="Empty text field. Type to compose a new post."
    const commentInput = await page.$('div[aria-label="Empty text field. Type to compose a new post."]');
    await wait(3);
    if (!commentInput) {
      throw new Error(ErrorMessage.COMMENT_INPUT_NOT_FOUND);
    }
    await commentInput?.click();
    sendToRenderer('profile-status', { profileId, message: Message.CLICK_COMMENT_INPUT });
    console.log('click comment input');
    await wait(3);

    await page.keyboard.type(randomCaption as string);
    sendToRenderer('profile-status', { profileId, message: `Type ${randomCaption}` });
    console.log(`type ${randomCaption}`);
    await wait(3);

    // close pages only keep last page
    const pages = await browser.pages();
    sendToRenderer('profile-status', { profileId, message: Message.CLOSE_PAGES });
    console.log('pages', pages?.length);
    each(pages, (page, index) => {
      if (index !== pages.length - 1) {
        page.close();
      }
    });

    // find post div with class name = "xc26acl x6s0dn4 x78zum5 xl56j7k x6ikm8r x10wlt62 xf7dkkf xv54qhq xlyipyv xp07o12"
    const post = await page.$('div[class*="xc26acl x6s0dn4 x78zum5 xl56j7k x6ikm8r x10wlt62 xf7dkkf xv54qhq xlyipyv xp07o12"]');
    await wait(3);
    if (!post) {
      throw new Error(ErrorMessage.POST_NOT_FOUND);
    }
    await post?.click();
    sendToRenderer('profile-status', { profileId, message: Message.CLICK_POST });
    console.log('click post');
    await wait(10);

    writeHistory({ profileId, postUrl });
    await sharePost({ profileId }, retryCount + 1);
  } catch (error) {
    console.log(error);
    const message = get(error, 'message', ErrorMessage.UNKNOWN_ERROR);
    sendToRenderer('profile-status', { profileId, message: Message.ERROR + message });
    if (message.includes(ErrorMessage.CONNECT_ECONNREFUSED)) {
      return;
    }
    if (message.includes(ErrorMessage.NAVIGATION_TIMEOUT)) {
      // close browser
      await stopProfile(profileId);
      await changePort({ profileId });
      sendToRenderer('profile-status', { profileId, message: Message.NETWORK_ERROR });
      return;
    }
    if (retryCount >= 5) {
      sendToRenderer('profile-status', { profileId, message: Message.MAX_RETRIES });
      return;
    }
    await sharePost({ profileId }, retryCount + 1);
  }
}

// run post
export const runPost = async (profileId: string, retryCount: number = 0) => {
  try {
    const setting = getSettingByProfileId(profileId);
    const caption = setting.caption?.caption;
    const images = setting.files;

    sendToRenderer('profile-status', { profileId, message: Message.START_POST });

    if (!caption || !images) {
      throw new Error(ErrorMessage.NOT_FOUND_CAPTION_OR_FILES);
    }

    // start profile
    const { data } = await startProfile(profileId);
    const wsUrl = data.wsUrl;

    const browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl
    });


    const page = await browser.newPage();
    await page.goto(`https://www.threads.com/`);
    await wait(10);

    // find div with data-bloks-name="ig.components.Icon" and click it
    const icon = await page.$('div[data-bloks-name="ig.components.Icon"]')
    if (icon) {
      await icon.click()
    }

    sendToRenderer('profile-status', { profileId, message: Message.OPEN_HOME_PAGE });

    // find div with class = "x1i10hfl x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x14z9mp xat24cr x1lziwak x2lwn1j xeuugli xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 x9f619 x3nfvp2 x1s688f xl56j7k x87ps6o xuxw1ft xc9qbxq x193iq5w x1g2r6go x12w9bfk x11xpdln xz4gly6 x19kf12q x9dqhi0 x6bh95i x1gzj6u4 x1hvtcl2 x1e1ff7m x16qb05n xi7iut8 x1dm3dyd x1pv694p x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x178xt8z x1lun4ml xso031l xpilrb4 xp07o12"
    const post = await page.$('div[class*="x1i10hfl x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x14z9mp xat24cr x1lziwak x2lwn1j xeuugli xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 x9f619 x3nfvp2 x1s688f xl56j7k x87ps6o xuxw1ft xc9qbxq x193iq5w x1g2r6go x12w9bfk x11xpdln xz4gly6 x19kf12q x9dqhi0 x6bh95i x1gzj6u4 x1hvtcl2 x1e1ff7m x16qb05n xi7iut8 x1dm3dyd x1pv694p x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x178xt8z x1lun4ml xso031l xpilrb4 xp07o12"]');
    await wait(3);
    if (!post) {
      throw new Error(ErrorMessage.NOT_FOUND_POST_BUTTON);
    }
    await post?.click();
    await wait(5);

    sendToRenderer('profile-status', { profileId, message: Message.UPLOAD_IMAGE });

    // input upload file
    const input = await page.$('input[type="file"]');
    await wait(3);
    if (!input) {
      throw new Error(ErrorMessage.INPUT_FILE_NOT_FOUND);
    }

    each(images, async (image) => {
      await input?.uploadFile(image);
      sendToRenderer('profile-status', { profileId, message: `Upload image ${image}` });
      console.log(`upload image ${image}`);
      await wait(5);
    });

    sendToRenderer('profile-status', { profileId, message: Message.CLICK_COMMENT_INPUT });

    // find dic with aria-placeholder="What's new?"
    const statusInput = await page.$('div[aria-placeholder="What\'s new?"]');
    await wait(3);
    if (!statusInput) {
      throw new Error(ErrorMessage.NOT_FOUND_STATUS_INPUT);
    }
    await statusInput?.click();
    await wait(3);

    // type status
    await page.keyboard.type(caption || '');
    await wait(3);

    // CTRL + ENTER
    await page.keyboard.down('Control');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Control');
    await wait(3);

    sendToRenderer('profile-status', { profileId, message: Message.DONE });

    // close browser

    // close all pages
    const pages = await browser.pages();
    each(pages, (page) => {
      page.close();
    });

    await wait(2);
    await browser.close();
    await wait(2);
  } catch (error) {
    console.log(error);
    const message = get(error, 'message', ErrorMessage.UNKNOWN_ERROR);
    sendToRenderer('profile-status', { profileId, message: Message.ERROR + message });
    if (message.includes(ErrorMessage.CONNECT_ECONNREFUSED)) {
      return;
    }
    if (retryCount >= 5) {
      sendToRenderer('profile-status', { profileId, message: Message.MAX_RETRIES });
      return;
    }
    await runPost(profileId, retryCount + 1);
  }
}
