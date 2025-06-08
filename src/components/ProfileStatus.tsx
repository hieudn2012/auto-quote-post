import useProfileStore from "@/store/profile.store"
import { twMerge } from "tailwind-merge"
import { capitalize, find } from "lodash"

interface ProfileStatusProps {
  id: string
}

export default function ProfileStatus({ id }: ProfileStatusProps) {
  const { profiles } = useProfileStore()
  const profile = find(profiles, { id })

  const colors = {
    ready: "border-2 border-green-500 text-green-500",
    running: "border-2 border-yellow-500 text-yellow-500",
    stopped: "border-2 border-red-500 text-red-500",
  }

  return (
    <div className={twMerge("text-xs inline-block rounded-md px-2 font-semibold py-[2px]", colors[profile?.status ?? "ready"])}>
      {capitalize(profile?.status)}
    </div>
  )
}