import { Setting } from '@/types/window'
import { ipcRenderer, contextBridge } from 'electron'
import { InvokeChannel } from './types'

const invoke = ipcRenderer.invoke as <T extends InvokeChannel>(channel: T, ...args: unknown[]) => Promise<ReturnType<typeof ipcRenderer.invoke>>

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
  getCurrentTime: () => invoke(InvokeChannel.GET_CURRENT_TIME),
  runProfile: (profileId: string) => invoke(InvokeChannel.RUN_PROFILE, profileId),
  stopProfile: (profileId: string) => invoke(InvokeChannel.STOP_PROFILE, profileId),
  getSettings: () => invoke(InvokeChannel.GET_SETTINGS),
  getSettingByProfileId: (profileId: string) => invoke(InvokeChannel.GET_SETTING_BY_PROFILE_ID, profileId),
  saveSettings: (settings: Setting) => invoke(InvokeChannel.SAVE_SETTINGS, settings),
  openSelectFolder: () => invoke(InvokeChannel.OPEN_SELECT_FOLDER),
  syncProfile: () => invoke(InvokeChannel.SYNC_PROFILE),
  getProfilesFromJson: () => invoke(InvokeChannel.GET_PROFILES_FROM_JSON),
  getHistory: () => invoke(InvokeChannel.GET_HISTORY),
})

contextBridge.exposeInMainWorld('sendToRenderer', (channel: string, data: unknown) => {
  ipcRenderer.send(channel, data)
})
