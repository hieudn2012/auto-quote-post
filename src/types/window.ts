export interface WindowInstance {
  api: {
    runProfile: (profileId: string) => Promise<void>
    stopProfile: (profileId: string) => Promise<void>
    sharePost: (profileId: string) => Promise<void>
    getAllError: () => Promise<string[]>
    getAllHistory: () => Promise<string[]>
  }
}

export const windowInstance = window as unknown as WindowInstance
