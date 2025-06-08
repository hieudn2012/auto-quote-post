import { create } from 'zustand'

interface Profile {
  id: string
  name: string
  status: 'ready' | 'running' | 'stopped'
}

interface ProfileStore {
  profiles: Profile[]
  setProfiles: (profiles: Profile[]) => void
  updateProfileStatus: (id: string, status: 'ready' | 'running' | 'stopped') => void
}

const useProfileStore = create<ProfileStore>((set) => ({
  profiles: [],
  setProfiles: (profiles: Profile[]) => set({ profiles }),
  updateProfileStatus: (id: string, status: 'ready' | 'running' | 'stopped') => set((state) => ({ profiles: state.profiles.map(p => p.id === id ? { ...p, status } : p) })),
  updateProfile: (id: string, profile: Profile) => set((state) => ({ profiles: state.profiles.map(p => p.id === id ? profile : p) })),
}))

export default useProfileStore