import { Profile } from '@/services/profile.service'
import { create } from 'zustand'

interface ProfileStore {
  profiles: Profile[]
  setProfiles: (profiles: Profile[]) => void
}

const useProfileStore = create<ProfileStore>((set) => ({
  profiles: [],
  setProfiles: (profiles: Profile[]) => set({ profiles }),
}))

export default useProfileStore