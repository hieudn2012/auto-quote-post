import { app } from "electron"
import fs from 'node:fs'
import path from 'node:path'

export const init = () => {
  const storePath = path.join(app.getPath('userData'), 'store')
  if (!fs.existsSync(storePath)) {
    fs.mkdirSync(storePath, { recursive: true })
  }

  // create file if not exists
  const storeFile = path.join(storePath, 'profiles.json')
  if (!fs.existsSync(storeFile)) {
    fs.writeFileSync(storeFile, JSON.stringify([]))
  }
}
