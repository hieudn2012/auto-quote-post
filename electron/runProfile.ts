import { GologinApi } from "gologin";
import { addBrowser } from "./manageProfiles";
import { TOKEN } from '../src/config';

const texts = [
  'Một ngày tốt lành 1',
  'Một ngày tốt lành 2',
  'Một ngày tốt lành 3',
  'Một ngày tốt lành 4',
  'Một ngày tốt lành 5',
]

export const runProfile = async (profileId: string) => {
  try {
    console.log('TOKEN', TOKEN);
    
    const GL = GologinApi({
      token: TOKEN,
    });

    const { browser } = await GL.launch({
      profileId,
    });

    // Lưu browser instance để quản lý
    addBrowser(profileId, browser);

    const page = await browser.newPage();
    await page.goto('https://www.threads.com/@phuong.ly.99/post/DI6an_XzzuO');


  } catch (error) {
    console.error(error, 'error');
  }
}
