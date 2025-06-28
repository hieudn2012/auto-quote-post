import { useGetFullInfoByProfileId } from "@/services/profile.service"
import { formatPostDate } from "@/utils/string"

export const LastPost = ({ profileId }: { profileId: string }) => {
  const { lastPost } = useGetFullInfoByProfileId(profileId)

  const isValid = !!lastPost?.created_at

  return (
    <div className="text-sm w-[100px]">
      {isValid ? formatPostDate(lastPost?.created_at || '') : '-'}
    </div>
  )
}