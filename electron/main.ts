import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { runProfile, sharePost, stopProfile } from './runProfile'
import { getAllError, getAllHistory } from './writeLog'
import { getSettings, saveSettings } from './setting'
import { Setting } from '@/types/window'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open DevTools automatically in development
    // win.webContents.openDevTools()
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}



// Đăng ký IPC handler
ipcMain.handle('get-current-time', async () => {
  console.log('get-current-time')
})

ipcMain.handle('run-profile', async (_event, profileId: string) => {
  runProfile(profileId)
})

ipcMain.handle('stop-profile', async (_event, profileId: string) => {
  stopProfile(profileId)
})

ipcMain.handle('get-all-error', async () => {
  return getAllError()
})

ipcMain.handle('get-all-history', async () => {
  return getAllHistory()
})

ipcMain.handle('get-settings', async () => {
  return getSettings()
})

ipcMain.handle('save-settings', async (_event, settings: Setting) => {
  saveSettings(settings)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

export function sendToRenderer<T>(channel: string, data: T) {
  if (win && win.webContents) {
    win.webContents.send(channel, data);
  }
}

app.whenReady().then(createWindow)
