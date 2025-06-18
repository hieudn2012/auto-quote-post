import { Setting } from '@/types/window'
import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

contextBridge.exposeInMainWorld('api', {
  getCurrentTime: () => ipcRenderer.invoke('get-current-time'),
  runProfile: (profileId: string) => ipcRenderer.invoke('run-profile', profileId),
  stopProfile: (profileId: string) => ipcRenderer.invoke('stop-profile', profileId),
  getAllError: () => ipcRenderer.invoke('get-all-error'),
  getAllHistory: () => ipcRenderer.invoke('get-all-history'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  getSettingByProfileId: (profileId: string) => ipcRenderer.invoke('get-setting-by-profile-id', profileId),
  saveSettings: (settings: Setting) => ipcRenderer.invoke('save-settings', settings),
  openSelectFolder: () => ipcRenderer.invoke('open-select-folder'),
  syncProfile: () => ipcRenderer.invoke('sync-profile'),
  getProfilesFromJson: () => ipcRenderer.invoke('get-profiles-from-json'),
})

contextBridge.exposeInMainWorld('sendToRenderer', (channel: string, data: any) => {
  ipcRenderer.send(channel, data)
})
