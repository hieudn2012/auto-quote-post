import axios from "axios";
import fs from 'fs';
import puppeteer from 'puppeteer-core';
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms * 1000));

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

    // save wsUrl to store.txt with format: profileId || wsUrl || status
    fs.writeFileSync('store.txt', `${profileId} || ${wsUrl} || ${data.status}`);
  } catch (error) {
    console.error(error, 'error');
  }
}

export const sharePost = async (profileId: string) => {
  const wsUrl = fs.readFileSync('store.txt', 'utf8').split('||')[1];
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsUrl
  });

  const page = await browser.newPage();
  await page.goto(`https://www.threads.com/@siukayy.16/post/DKdghD9zi_W`);

  // find svg with aria-label="Repost"
  const svg = await page.$('svg[aria-label="Repost"]');
  console.log(svg, 'svg');
  await wait(3);
  await svg?.click();
  await wait(3);
  console.log('click repost');
  await wait(5);

  // find svg with aria-label = Quote 
  const svgQuote = await page.$('svg[aria-label="Quote"]');
  await wait(3); 
  svgQuote?.click();
  await wait(3); 

  // find input with type = file
  const input = await page.$('input[type="file"]');
  console.log(input, 'input');

  // upload image '/Users/admin/Desktop/Screenshot 2025-05-28 at 14.17.19.png' to input
  await input?.uploadFile('/Users/admin/Desktop/Screenshot 2025-06-05 at 18.43.56.png');
  await wait(3);
  console.log('upload image');
}
