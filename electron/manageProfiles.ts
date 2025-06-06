import { Browser } from "puppeteer";

// Lưu trữ các browser instances đang chạy
const activeBrowsers = new Map<string, Browser>();

// Lấy danh sách profiles đang chạy
export const getActiveProfiles = () => {
  return Array.from(activeBrowsers.keys());
}

// Hàm để lưu browser instance
export const addBrowser = (profileId: string, browser: Browser) => {
  activeBrowsers.set(profileId, browser);
  console.log(`Đã thêm profile ${profileId} vào danh sách quản lý`);
}

// Hàm đóng một profile cụ thể
export const closeProfile = async (profileId: string) => {
  try {
    const browser = activeBrowsers.get(profileId);
    if (browser) {
      await browser.close();
      activeBrowsers.delete(profileId);
      console.log(`Đã đóng profile ${profileId}`);
      return true;
    } else {
      console.log(`Không tìm thấy profile ${profileId}`);
      return false;
    }
  } catch (error) {
    console.error(`Lỗi khi đóng profile ${profileId}:`, error);
    return false;
  }
}

// Hàm đóng tất cả profiles
export const closeAllProfiles = async () => {
  try {
    console.log('Bắt đầu đóng tất cả profiles...');
    const closePromises = Array.from(activeBrowsers.keys()).map(async (profileId) => {
      const browser = activeBrowsers.get(profileId);
      if (browser) {
        try {
          await browser.close();
          activeBrowsers.delete(profileId);
          console.log(`Đã đóng profile ${profileId}`);
        } catch (err) {
          console.error(`Lỗi khi đóng profile ${profileId}:`, err);
        }
      }
    });

    await Promise.all(closePromises);
    console.log('Đã đóng tất cả profiles thành công');
  } catch (error) {
    console.error('Lỗi khi đóng tất cả profiles:', error);
  }
}
