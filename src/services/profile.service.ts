import { useQuery } from "@tanstack/react-query"
import request from "@/utils/request"
import { find, findLast, get, sortBy } from "lodash"
import useProfileStore from "@/store/profile.store"
import { useHistoryStore } from "@/store/history.store"

const GET_PROFILES = `/browser/v2`

export interface Profile {
  id: string
  name: string
  proxy: {
    id: string
    host: string
    customName: string
    port: number
    autoProxyRegion: string
  }
  notes: string
  folders: string[]
}

export interface GetProfileParams {
  page: number
}

const getProfiles = async (params: GetProfileParams): Promise<Profile[]> => {
  const data = await request.get(GET_PROFILES, { params })
  const sortedProfiles = sortBy(get(data, 'profiles', []), 'name').reverse()

  return sortedProfiles
}

export const useGetProfiles = (params: GetProfileParams) => {
  return useQuery<Profile[], Error>({
    queryKey: [GET_PROFILES, params],
    queryFn: () => getProfiles(params),
  })
}

export const useGetProfileById = (id: string) => {
  const { profiles } = useProfileStore()
  return find(profiles, (profile) => profile.id === id)
}

export const useGetFullInfoByProfileId = (id: string) => {
  const { profiles } = useProfileStore()
  const { history } = useHistoryStore()
  const profile = find(profiles, (profile) => profile.id === id)
  const lastPost = findLast(history, (post) => post.profile_id === id)
  return { ...profile, lastPost }
}
