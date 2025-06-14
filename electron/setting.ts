import { Setting } from "@/types/window"
import fs from 'node:fs'
import path from 'path'

export const getSettings = (): Setting => {
  const path = `settings.json`
  const settings = fs.readFileSync(path, 'utf8')
  return JSON.parse(settings)
}

export const saveSettings = (settings: Setting) => {
  try {
    const settingPath = `settings.json`
    // create photos folder if not exists
    const photosPath = path.join(settings.working_directory, 'photos')

    if (!fs.existsSync(photosPath)) {
      fs.mkdirSync(photosPath, { recursive: true })
    }

    fs.writeFileSync(settingPath, JSON.stringify(settings, null, 2))
  } catch (error) {
    console.error(error)
  }
}

export const getFirstCaption = () => {
  const settings = getSettings()
  return settings.captions[0]
}

export const getWorkingDirectory = () => {
  const settings = getSettings()
  return settings.working_directory
}

export const getRandomImagesFromRandomFolder = () => {
  const workingDirectory = getWorkingDirectory()

  const photosPath = fs.readdirSync(`${workingDirectory}/photos`)
  // fillter ignore .DS_Store
  const filteredPhotosPath = photosPath.filter(item => item !== '.DS_Store')

  if (filteredPhotosPath.length === 0) {
    return []
  }

  // Randomly select a folder
  const randomFolder = filteredPhotosPath[Math.floor(Math.random() * filteredPhotosPath.length)]

  // Get all image files from the selected folder
  const imageFiles = fs.readdirSync(`${workingDirectory}/photos/${randomFolder}`)
    .filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)
    })

  return imageFiles.map(file => `${workingDirectory}/photos/${randomFolder}/${file}`)
}
