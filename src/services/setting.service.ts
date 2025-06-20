import { useEffect, useState } from "react"
import { Setting, windowInstance } from "@/types/window"

export const useGetSettings = () => {
  const [settings, setSettings] = useState<Setting>({
    working_directory: '',
    url: '',
    token: '',
    captions: [],
    profiles: [],
    media_folders: [],
    urls: [],
    groups: [],
  })
  
  useEffect(() => {
    windowInstance.api.getSettings().then((data) => {
      setSettings(data)
    })
  }, [])

  return settings
}