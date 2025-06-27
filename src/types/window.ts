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
    clearHistory: (type: ClearHistoryType) => Promise<void>
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
  proxy_ids: string[]
}

export interface Proxy {
  id: string
  name: string
  host: string
  port: number
  username: string
  password: string
  mode: 'socks5' | 'http'
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

export enum ClearHistoryType {
  ALL = 'all',
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_3_DAYS = 'last_3_days',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_60_DAYS = 'last_60_days'
}
export interface ClearHistory {
  type: ClearHistoryType,
}

export const windowInstance = window as unknown as WindowInstance
