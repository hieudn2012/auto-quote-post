import { Setting } from "@/types/window"
import fs from 'node:fs'
import path from 'path'
import { app } from 'electron'
import { filter, find, map } from "lodash"
import { getRandomUrlByProfileId } from "./history"

export const getFolderSystem = () => {
  const appPath = app.getPath('userData')
  return {
    root: appPath,
    settings: path.join(appPath, 'settings.json'),
    profiles: path.join(appPath, 'profiles.json'),
    store: path.join(appPath, 'store'),
    browsers: path.join(appPath, 'store', 'browsers'),
    history: path.join(appPath, 'store', 'histories.txt'),
    screenshots: path.join(appPath, 'store', 'screenshots'),
  }
}

export const getSettings = (): Setting => {
  const folderSystem = getFolderSystem()
  const settings = fs.readFileSync(folderSystem.settings, 'utf8')
  const defaultSettings: Setting = {
    working_directory: '',
    token: '',
    url: '',
    profiles: [],
    captions: [],
    media_folders: [],
    urls: [],
    groups: [],
    proxies: [],
  }
  const setting = JSON.parse(settings)
  return { ...defaultSettings, ...setting }
}

export const saveSettings = (settings: Setting) => {
  try {
    const proxy_ids_in_system = settings.proxies.map((proxy) => proxy.id)

    const newSettings = {
      ...settings,
      groups: map(settings.groups, (group) => {
        return {
          ...group,
          proxy_ids: filter(group.proxy_ids, (proxy_id) => proxy_ids_in_system.includes(proxy_id))
        }
      })
    }

    const folderSystem = getFolderSystem()
    fs.writeFileSync(folderSystem.settings, JSON.stringify(newSettings, null, 2))
  } catch (error) {
    console.error(error)
  }
}

export const getFirstCaption = () => {
  const settings = getSettings()
  return settings.captions[0]
}

export const getSettingByProfileId = (profileId: string) => {
  const settings = getSettings()
  const group_id = find(settings.profiles, (profile) => profile.id === profileId)?.group_id
  const group = find(settings.groups, (group) => group.id === group_id)

  const caption_ids = group?.caption_ids
  const media_folder_ids = group?.media_folder_ids
  const proxy_ids = group?.proxy_ids

  const randomProxyId = proxy_ids?.[Math.floor(Math.random() * proxy_ids.length)]
  const proxy = find(settings.proxies, (proxy) => proxy.id === randomProxyId)

  const randomCaptionId = caption_ids?.[Math.floor(Math.random() * caption_ids.length)]
  const randomMediaFolderId = media_folder_ids?.[Math.floor(Math.random() * media_folder_ids.length)]

  const url = getRandomUrlByProfileId({ profileId })
  const caption = find(settings.captions, (caption) => caption.id === randomCaptionId)
  const media_folder = find(settings.media_folders, (media_folder) => media_folder.id === randomMediaFolderId)

  // in media_folder have many folder, each folder have many images or videos
  const media_folder_path = media_folder?.path || ''

  // Get all folders in media_folder_path
  const folders = fs.readdirSync(media_folder_path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  // Randomly select one folder
  const randomFolder = folders[Math.floor(Math.random() * folders.length)]
  const selectedFolderPath = path.join(media_folder_path, randomFolder)

  // Get all files from selected folder
  const folderFiles = fs.readdirSync(selectedFolderPath)
    .filter(file => ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4'].includes(path.extname(file)))
    .slice(0, 5) // Max 5 files
    .map(file => path.join(selectedFolderPath, file))

  return {
    ...group,
    url,
    caption,
    media_folder,
    proxy,
    files: folderFiles
  }
}
