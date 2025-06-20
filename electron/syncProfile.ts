import axios from "axios";
import { get } from "lodash";
import { getFolderSystem, getSettings } from "./setting";
import fs from "node:fs";

export interface Profile {
  id: string
  name: string
  proxy: {
    id: string
    host: string
    customName: string
    port: number
    autoProxyRegion: string
  }
  notes: string
}

const getProfiles = async (page: number) => {
  const settings = getSettings()
  const data = await axios.get(`https://api.gologin.com/browser/v2`, {
    params: { page }, headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.token}`
    }
  })

  return get(data, 'data.profiles', [])
}

export const syncProfile = async () => {
  try {
    const [page1, page2, page3, page4, page5, page6, page7, page8, page9, page10] = await Promise.all([
      getProfiles(1),
      getProfiles(2),
      getProfiles(3),
      getProfiles(4),
      getProfiles(5),
      getProfiles(6),
      getProfiles(7),
      getProfiles(8),
      getProfiles(9),
      getProfiles(10),
    ])

    const profiles = [...page1, ...page2, ...page3, ...page4, ...page5, ...page6, ...page7, ...page8, ...page9, ...page10]

    // save to file json
    const folderSystem = getFolderSystem()
    fs.writeFileSync(folderSystem.profiles, JSON.stringify(profiles, null, 2))

    return profiles
  } catch (error) {
    console.log(error, 'error');
  }
}

export const getProfilesFromJson = async () => {
  try {
    const folderSystem = getFolderSystem()
    const data = fs.readFileSync(folderSystem.profiles, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}
