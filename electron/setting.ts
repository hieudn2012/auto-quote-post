import { Setting } from "@/types/window"
import fs from 'node:fs'
import path from 'path'
import { app } from 'electron'

export const getFolderSystem = () => {
  const appPath = app.getPath('userData')
  return {
    root: appPath,
    settings: path.join(appPath, 'settings.json'),
    profiles: path.join(appPath, 'profiles.json'),
    store: path.join(appPath, 'store'),
    browsers: path.join(appPath, 'store', 'browsers'),
  }
}

export const getSettings = (): Setting => {
  const folderSystem = getFolderSystem()
  const settings = fs.readFileSync(folderSystem.settings, 'utf8')
  return JSON.parse(settings)
}

export const saveSettings = (settings: Setting) => {
  try {
    const folderSystem = getFolderSystem()
    // create photos folder if not exists
    const photosPath = path.join(settings.working_directory, 'photos')

    if (!fs.existsSync(photosPath)) {
      fs.mkdirSync(photosPath, { recursive: true })
    }

    fs.writeFileSync(folderSystem.settings, JSON.stringify(settings, null, 2))
  } catch (error) {
    console.error(error)
  }
}

export const getFirstCaption = () => {
  const settings = getSettings()
  return settings.captions[0]
}

export const getWorkingDirectory = (profileId: string) => {
  const setting = getSettingByProfileId(profileId)
  const settings = getSettings()
  const folderIds = setting?.media_folder_ids || []
  const randomFolderId = folderIds[Math.floor(Math.random() * folderIds.length)]
  const folder = settings.media_folders.find((elm) => elm.id === randomFolderId)
  return folder?.path || ''
}

export const getRandomImagesFromRandomFolder = (profileId: string) => {
  const workingDirectory = getWorkingDirectory(profileId)

  const photosPath = fs.readdirSync(`${workingDirectory}`)
  // fillter ignore .DS_Store
  const filteredPhotosPath = photosPath.filter(item => item !== '.DS_Store')

  if (filteredPhotosPath.length === 0) {
    return []
  }

  // Randomly select a folder
  const randomFolder = filteredPhotosPath[Math.floor(Math.random() * filteredPhotosPath.length)]

  // Get all image files from the selected folder
  const imageFiles = fs.readdirSync(`${workingDirectory}/${randomFolder}`)
    .filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4'].includes(ext)
    })

  return imageFiles.map(file => `${workingDirectory}/${randomFolder}/${file}`)
}

export const getSettingByProfileId = (profileId: string) => {
  const settings = getSettings()
  return settings.profiles.find((profile) => profile.id === profileId)
}