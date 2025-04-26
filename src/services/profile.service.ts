import { useQuery } from "@tanstack/react-query"
import request from "@/utils/request"
import { get } from "lodash"

const GET_PROFILES = `/browser/v2`

interface Profile {
  id: string
  name: string
  proxy: {
    id: string
    host: string
    customName: string
    port: number
    autoProxyRegion: string
  }
}

const getProfiles = async ():Promise<Profile[]> => {
  const data = await request.get(GET_PROFILES)
  return get(data, 'profiles', [])
}

export const useGetProfiles = () => {
  return useQuery({
    queryKey: [GET_PROFILES],
    queryFn: getProfiles,
  })
}
