import { map, split, trim } from "lodash";
import { getFolderSystem } from "./setting"
import fs from 'node:fs'

export const getHistory = () => {
  try {
    const { history } = getFolderSystem()
    const historyData = fs.readFileSync(history, 'utf8');
    const lines = split(historyData, '\n').map(line => line.trim()).filter(line => line !== '');
    return map(lines, (line) => {
      const [profileId, postUrl, createdAt] = split(line, '||');
      return {
        profile_id: trim(profileId),
        post_url: trim(postUrl),
        created_at: trim(createdAt)
      }
    })
  } catch (error) {
    console.error(error)
    return []
  }
}