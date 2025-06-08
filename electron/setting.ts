import { Setting } from "@/types/window"
import fs from 'node:fs'

export const getSettings = (): Setting => {
  const path = `settings.json`
  const settings = fs.readFileSync(path, 'utf8')
  return JSON.parse(settings)
}

export const saveSettings = (settings: Setting) => {
  const path = `settings.json`
  fs.writeFileSync(path, JSON.stringify(settings, null, 2))
}