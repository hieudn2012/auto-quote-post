import { IpcRendererEvent } from 'electron'

export interface WindowInstance {
  api: {
    runProfile: (profileId: string) => Promise<void>
    stopProfile: (profileId: string) => Promise<void>
    getAllError: () => Promise<string[]>
    getAllHistory: () => Promise<string[]>
    getSettings: () => Promise<Setting>
    saveSettings: (settings: Setting) => Promise<void>
    openSelectFolder: () => Promise<{ filePaths: string[], canceled: boolean }>
  }
  ipcRenderer?: {
    on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void
    off: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void
  }
}

export interface Setting {
  working_directory: string
  token: string
  captions: {
    id: string
    label: string
    caption: string
  }[]
  profiles: {
    id: string
    caption_ids: string[]
  }[]
  media_folders: {
    id: string
    name: string
    path: string
  }[]
}

export const windowInstance = window as unknown as WindowInstance
