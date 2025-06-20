import useSettingStore from "@/store/setting.store"
import { windowInstance } from "@/types/window"
import { useEffect } from "react"

export const useSetting = () => {
  const { settings, setSettings } = useSettingStore()

  useEffect(() => {
    console.log('call useEffect');
    
    windowInstance.api.getSettings().then((data) => {
      setSettings(data)
    })
  }, [setSettings])

  return { settings, setSettings }
}