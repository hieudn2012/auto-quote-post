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
    const profiles = [];
    
    // Fetch profiles page by page sequentially to avoid spamming
    for (let page = 1; page <= 15; page++) {
      const pageProfiles = await getProfiles(page);
      profiles.push(...pageProfiles);
      
      // Add small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

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
