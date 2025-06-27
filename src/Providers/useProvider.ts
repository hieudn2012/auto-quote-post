import { useCallback } from "react"
import { useHistoryStore } from "@/store/history.store"
import useProfileStore from "@/store/profile.store"
import useSettingStore from "@/store/setting.store"
import { windowInstance } from "@/types/window"

export const useProvider = () => {
  const { setHistory } = useHistoryStore()
  const { setSettings } = useSettingStore()
  const { setProfiles } = useProfileStore()

  const handleInitApp = useCallback(() => {
    windowInstance.api.getHistory().then((history) => {
      setHistory(history)
    })
    windowInstance.api.getSettings().then((data) => {
      setSettings(data)
    })
    windowInstance.api.getProfilesFromJson().then((profiles) => {
      setProfiles(profiles)
    })
  }, [setHistory, setSettings, setProfiles])
  
  return {
    loadApp: handleInitApp,
  }
}

