export interface WindowInstance {
  api: {
    runProfile: (profileId: string) => Promise<void>
    stopProfile: (profileId: string) => Promise<void>
    sharePost: (profileId: string) => Promise<void>
  }
}

export const windowInstance = window as unknown as WindowInstance
