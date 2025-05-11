import { GologinApi } from "gologin";

export const TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODBjODY0Yjg5ZmUyYTY1MWNjMjE2YzIiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2ODBjOGQxZGNiZTA1YTE2MTExN2IyMTkifQ.3r1Gnp8WVYQzg0iYS63xTeUw0-qshuQviUqg-XeYegu8`

const texts = [
  'Một ngày tốt lành 1',
  'Một ngày tốt lành 2',
  'Một ngày tốt lành 3',
  'Một ngày tốt lành 4',
  'Một ngày tốt lành 5',
]

export const runProfile = async (profileId: string) => {
  try {
    const GL = GologinApi({
      token: TOKEN,
    });

    const { browser } = await GL.launch({
      profileId,
    });
    const page = await browser.newPage();
    await page.goto('https://www.threads.com/@phuong.ly.99/post/DI6an_XzzuO');

    // Đợi cho element xuất hiện
    await page.waitForSelector('.x4vbgl9.xp7jhwk.x1k70j0n');

    // Lấy element
    const element = await page.$('.x4vbgl9.xp7jhwk.x1k70j0n');

    // cấu trúc element > div > div1, div2, div3 => lấy div 3
    const div3 = await element?.$('div:nth-child(3)');
    // click vào div3
    await div3?.click();

    // Đợi cho element xuất hiện
    const selector = '.x1i10hfl.x1qjc9v5.xjbqb8w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xeuugli.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x3nfvp2.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6bh95i.x1re03b8.x1hvtcl2.x3ug3ww.xyi19xy.x1ccrb07.xtf3nb5.x1pc53ja.xjwf9q1.xz9dl7a.xn6708d.xsag5q8.x1ye3gou.x1g2r6go.x12w9bfk.x11xpdln.xh8yej3.xk4oym4.x1eos6md';
    await page.waitForSelector(selector);

    // Lấy element ở vị trí thứ hai
    const elements = await page.$$(selector);
    const quoteElement = elements[1];
    await quoteElement?.click();

    // nhập bàn phím vào element
    // chờ 2 giây
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.keyboard.type(texts[Math.floor(Math.random() * texts.length)]);

    const input = await page.$('input[type="file"]');
    // upload file

    if (input) {
      await input.uploadFile('/Users/admin/Desktop/Screenshot 2025-04-27 at 00.01.24.png');
    }


  } catch (error) {
    console.error(error, 'error');
  }
}
