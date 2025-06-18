import puppeteer from 'puppeteer-core';
import { writeBrowser, writeHistory, writeError, getBrowser } from "./writeLog";
import { each, get } from "lodash";
import { sendToRenderer } from "./main";
import { getRandomImagesFromRandomFolder, getSettings, getSettingByProfileId } from "./setting";
import axios from "axios";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms * 1000));

const ports = [30000, 30001, 30002];

const changePort = async ({ profileId }: { profileId: string }) => {
  const port = ports[Math.floor(Math.random() * ports.length)];
  sendToRenderer('profile-status', { profileId, message: `Change port to ${port}` });
  const data = {
    autoProxyRegion: "us",
    changeIpUrl: "",
    host: "51.81.186.144",
    mode: "socks5",
    password: "",
    port,
    torProxyRegion: "us",
    username: ""
  }

  const settings = getSettings()

  return axios.patch(`https://api.gologin.com/browser/${profileId}/proxy`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.token}`
    }
  })
}

const startProfile = async (profileId: string) => {
  sendToRenderer('profile-status', { profileId, message: 'Start profile' });
  return axios.post('http://localhost:36912/browser/start-profile', {
    profileId,
    sync: true
  })
}

export const stopProfile = async (profileId: string) => {
  sendToRenderer('profile-status', { profileId, message: 'Stop profile' });
  return axios.post('http://localhost:36912/browser/stop-profile', {
    profileId
  })
}

export const runProfile = async (profileId: string) => {
  try {
    const { data } = await startProfile(profileId);
    const wsUrl = data.wsUrl;

    writeHistory({ profileId, message: 'Start run profile', dateTime: new Date().toISOString() });
    writeBrowser({ profileId, wsUrl });

    await sharePost({ profileId, postUrl: 'https://www.threads.com/@siukayy.16/post/DKdghD9zi_W' });

  } catch (error) {
    await changePort({ profileId });
    await wait(2);
    writeError({ profileId, error: get(error, 'response.data', 'Unknown error') });
    await runProfile(profileId);
  }
}

export const sharePost = async ({ profileId, postUrl }: { profileId: string, postUrl: string }) => {
  try {
    const setting = await getSettingByProfileId(profileId);
    const randomFolder = setting?.media_folder_ids[Math.floor(Math.random() * setting?.media_folder_ids.length)];
    const randomCaption = setting?.caption_ids[Math.floor(Math.random() * setting?.caption_ids.length)];

    const wsUrl = getBrowser(profileId);
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl
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
    await wait(3);

    // find svg with aria-label="Repost"
    const svg = await page.$('svg[aria-label="Repost"]');
    await wait(3);
    if (!svg) {
      throw new Error('Repost button not found');
    }
    await svg?.click();
    sendToRenderer('profile-status', { profileId, message: 'Click repost' });
    console.log('click repost');
    await wait(5);

    // find svg with aria-label = Quote 
    const svgQuote = await page.$('svg[aria-label="Quote"]');
    await wait(3);
    if (!svgQuote) {
      throw new Error('Quote button not found');
    }
    await svgQuote?.click();
    sendToRenderer('profile-status', { profileId, message: 'Click quote' });
    console.log('click quote');
    await wait(3);
    // find input with type = file
    const input = await page.$('input[type="file"]');
    await wait(3);
    if (!input) {
      throw new Error('Input file not found');
    }

    console.log('input found');
    const images = getRandomImagesFromRandomFolder();
    each(images, async (image) => {
      await input?.uploadFile(image);
      sendToRenderer('profile-status', { profileId, message: `Upload image ${image}` });
      console.log(`upload image ${image}`);
      await wait(5);
    });


    sendToRenderer('profile-status', { profileId, message: 'Upload image' });
    console.log('upload image');
    await wait(5);

    // find div with aria-label="Empty text field. Type to compose a new post."
    const commentInput = await page.$('div[aria-label="Empty text field. Type to compose a new post."]');
    await wait(3);
    if (!commentInput) {
      throw new Error('Comment input not found');
    }
    await commentInput?.click();
    sendToRenderer('profile-status', { profileId, message: 'Click comment input' });
    console.log('click comment input');
    await wait(3);

    await page.keyboard.type(randomCaption as string);
    sendToRenderer('profile-status', { profileId, message: `Type ${randomCaption}` });
    console.log(`type ${randomCaption}`);
    await wait(3);

    // close pages only keep last page
    const pages = await browser.pages();
    sendToRenderer('profile-status', { profileId, message: 'Close pages' });
    console.log('pages', pages?.length);
    each(pages, (page, index) => {
      if (index !== pages.length - 1) {
        page.close();
      }
    });

    // await stopProfile(profileId);
    // await wait(2);
    sendToRenderer('profile-status', { profileId, message: 'Done! 🎉' });

  } catch (error) {
    const message = get(error, 'message', 'Unknown error');
    writeError({ profileId, error: message });
    sendToRenderer('profile-status', { profileId, message: 'Error: ' + message });
    if (message.includes('connect ECONNREFUSED')) {
      return;
    }
    if (message.includes('Navigation timeout')) {
      return;
    }
    await sharePost({ profileId, postUrl });
  }
}
