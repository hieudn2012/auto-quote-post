import { Profile } from '@/services/profile.service'
import { IpcRendererEvent } from 'electron'

export interface WindowInstance {
  api: {
    runProfile: (profileId: string) => Promise<void>
    stopProfile: (profileId: string) => Promise<void>
    getSettings: () => Promise<Setting>
    getSettingByProfileId: (profileId: string) => Promise<ProfileSetting>
    saveSettings: (settings: Setting) => Promise<void>
    openSelectFolder: () => Promise<{ filePaths: string[], canceled: boolean }>
    syncProfile: () => Promise<Profile[]>
    getProfilesFromJson: () => Promise<Profile[]>
    getHistory: () => Promise<History[]>
  }
  ipcRenderer?: {
    on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void
    off: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void
  }
}

export interface ProfileSetting {
  id: string
  group_id: string
}

export interface GroupSetting {
  id: string
  name: string
  caption_ids: string[]
  media_folder_ids: string[]
  url_ids: string[]
  proxy_id: string
}

export interface Proxy {
  id: string
  name: string
  host: string
  port: number
  username: string
  password: string
}

export interface Setting {
  working_directory: string
  url: string
  token: string
  captions: {
    id: string
    label: string
    caption: string
  }[]
  profiles: ProfileSetting[]
  media_folders: {
    id: string
    name: string
    path: string
  }[]
  urls: {
    id: string
    label: string
    value: string
  }[]
  groups: GroupSetting[]
  proxies: Proxy[]
}

export interface History {
  profile_id: string
  post_url: string
  created_at: string
}

export const windowInstance = window as unknown as WindowInstance
