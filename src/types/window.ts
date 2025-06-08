export interface WindowInstance {
  api: {
    runProfile: (profileId: string) => Promise<void>
    stopProfile: (profileId: string) => Promise<void>
    sharePost: (profileId: string) => Promise<void>
    getAllError: () => Promise<string[]>
    getAllHistory: () => Promise<string[]>
    getSettings: () => Promise<Setting>
    saveSettings: (settings: Setting) => Promise<void>
  }
}

export interface Setting {
  working_directory: string
  token: string
  captions: string[]
}

export const windowInstance = window as unknown as WindowInstance
