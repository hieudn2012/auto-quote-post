import { create } from 'zustand'

type ProfileStatus = 'ready' | 'running' | 'wating-to-stop' | 'stopped' | 'done'

interface Profile {
  id: string
  name: string
  status: ProfileStatus
}

interface ProfileStore {
  profiles: Profile[]
  setProfiles: (profiles: Profile[]) => void
  updateProfileStatus: (id: string, status: ProfileStatus) => void
}

const useProfileStore = create<ProfileStore>((set) => ({
  profiles: [],
  setProfiles: (profiles: Profile[]) => set({ profiles }),
  updateProfileStatus: (id: string, status: ProfileStatus) => set((state) => ({ profiles: state.profiles.map(p => p.id === id ? { ...p, status } : p) })),
  updateProfile: (id: string, profile: Profile) => set((state) => ({ profiles: state.profiles.map(p => p.id === id ? profile : p) })),
}))

export default useProfileStore