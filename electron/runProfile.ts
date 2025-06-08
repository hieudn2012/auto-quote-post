import axios from "axios";
import puppeteer from 'puppeteer-core';
import { writeBrowser, writeHistory, writeError, getBrowser } from "./writeLog";
import { TOKEN } from "../src/config";
import { each, get } from "lodash";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms * 1000));

const changePort = async ({ profileId }: { profileId: string }) => {
  const data = {
    autoProxyRegion: "us",
    changeIpUrl: "",
    host: "51.81.186.144",
    mode: "socks5",
    password: "",
    port: 30001,
    torProxyRegion: "us",
    username: ""
  }

  return axios.patch(`https://api.gologin.com/browser/${profileId}/proxy`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    }
  })
}

const startProfile = async (profileId: string) => {
  return axios.post('http://localhost:36912/browser/start-profile', {
    profileId,
    sync: true
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const stopProfile = async (profileId: string) => {
  return axios.post('http://localhost:36912/browser/stop-profile', {
    profileId
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
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
    writeError({ profileId, error: get(error, 'response.data', 'Unknown error') });
    await runProfile(profileId);
  }
}

export const sharePost = async ({ profileId, postUrl }: { profileId: string, postUrl: string }) => {
  try {
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
    console.log('click repost');
    await wait(5);

    // find svg with aria-label = Quote 
    const svgQuote = await page.$('svg[aria-label="Quote"]');
    await wait(3);
    if (!svgQuote) {
      throw new Error('Quote button not found');
    }
    await svgQuote?.click();
    console.log('click quote');
    await wait(3);
    // find input with type = file
    const input = await page.$('input[type="file"]');
    await wait(3);
    if (!input) {
      throw new Error('Input file not found');
    }

    console.log('input found');
    // upload image '/Users/admin/Desktop/Screenshot 2025-05-28 at 14.17.19.png' to input
    await input?.uploadFile('/Users/admin/Desktop/Screenshot 2025-06-05 at 18.43.56.png');
    console.log('upload image');
    await wait(5);

    // find div with aria-label="Empty text field. Type to compose a new post."
    const commentInput = await page.$('div[aria-label="Empty text field. Type to compose a new post."]');
    await wait(3);
    if (!commentInput) {
      throw new Error('Comment input not found');
    }
    await commentInput?.click();
    console.log('click comment input');
    await wait(3);

    await page.keyboard.type('Hello');
    console.log('type hello');
    await wait(3);

    // close pages only keep last page
    const pages = await browser.pages();
    console.log('pages', pages?.length);
    each(pages, (page, index) => {
      if (index !== pages.length - 1) {
        page.close();
      }
    });
  } catch (error) {
    const message = get(error, 'message', 'Unknown error');
    writeError({ profileId, error: message });
    if (message.includes('connect ECONNREFUSED')) {
      return;
    }
    await sharePost({ profileId, postUrl });
  }
}
