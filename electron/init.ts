import fs from 'node:fs'
import { getFolderSystem } from "./setting"

export const init = () => {
  const folderSystem = getFolderSystem()
  if (!fs.existsSync(folderSystem.root)) {
    fs.mkdirSync(folderSystem.root, { recursive: true })
  }

  // create file if not exists
  const storeFile = folderSystem.profiles
  if (!fs.existsSync(storeFile)) {
    fs.writeFileSync(storeFile, JSON.stringify([]))
  }

  const settingsJson = folderSystem.settings
  if (!fs.existsSync(settingsJson)) {
    fs.writeFileSync(settingsJson, JSON.stringify({}))
  }

  const profilesJson = folderSystem.profiles
  if (!fs.existsSync(profilesJson)) {
    fs.writeFileSync(profilesJson, JSON.stringify([]))
  }

  const storeFolder = folderSystem.store
  if (!fs.existsSync(storeFolder)) {
    fs.mkdirSync(storeFolder, { recursive: true })
  }

  const browsersFolder = folderSystem.browsers
  if (!fs.existsSync(browsersFolder)) {
    fs.mkdirSync(browsersFolder, { recursive: true })
  }

  const historyFile = folderSystem.history
  if (!fs.existsSync(historyFile)) {
    fs.writeFileSync(historyFile, '')
  }
}