import { ipcMain, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { GologinApi } from "gologin";
const activeBrowsers = /* @__PURE__ */ new Map();
const addBrowser = (profileId, browser) => {
  activeBrowsers.set(profileId, browser);
  console.log(`Đã thêm profile ${profileId} vào danh sách quản lý`);
};
const TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODNlYTBmOTkzNTk4YmY2MzEyOWQ2MDMiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2ODNlYTM1ZDI1OTM5YTk0YWM3ODliNzMifQ.LAhYVmCNhFNt0CdMmE2CwGOqDt4541SAHmghaMnvp8o`;
const runProfile = async (profileId) => {
  try {
    console.log("TOKEN", TOKEN);
    const GL = GologinApi({
      token: TOKEN
    });
    const { browser } = await GL.launch({
      profileId
    });
    addBrowser(profileId, browser);
    const page = await browser.newPage();
    await page.goto("https://www.threads.com/@phuong.ly.99/post/DI6an_XzzuO");
  } catch (error) {
    console.error(error, "error");
  }
};
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
ipcMain.handle("get-current-time", async () => {
  console.log("get-current-time");
});
ipcMain.handle("run-profile", async (_event, profileId) => {
  runProfile(profileId);
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
