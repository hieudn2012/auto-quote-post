import { useHistoryStore } from "@/store/history.store"
import useProfileStore from "@/store/profile.store"
import useSettingStore from "@/store/setting.store"
import { windowInstance } from "@/types/window"
import { useEffect } from "react"

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { setHistory } = useHistoryStore()
  const { setSettings } = useSettingStore()
  const { setProfiles } = useProfileStore()

  useEffect(() => {
    windowInstance.api.getHistory().then((history) => {
      setHistory(history)
    })
  }, [setHistory])

  useEffect(() => {
    windowInstance.api.getSettings().then((data) => {
      setSettings(data)
    })
  }, [setSettings])

  useEffect(() => {
    windowInstance.api.getProfilesFromJson().then((profiles) => {
      setProfiles(profiles)
    })
  }, [setProfiles])

  return <>{children}</>
}
