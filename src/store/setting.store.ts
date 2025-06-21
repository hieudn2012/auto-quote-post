import { create } from "zustand";
import { Setting } from "@/types/window";

interface SettingStore {
  settings: Setting
  setSettings: (settings: Setting) => void
}

const useSettingStore = create<SettingStore>((set) => ({
  settings: {
    working_directory: '',
    url: '',
    token: '',
    captions: [],
    profiles: [],
    media_folders: [],
    urls: [],
    groups: [],
  },
  setSettings: (settings: Setting) => set({ settings }),
}))

export default useSettingStore
