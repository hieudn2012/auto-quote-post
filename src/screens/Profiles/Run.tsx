import Button from "@/components/Button"
import useProfileStore from "@/store/profile.store" 
import { find } from "lodash"

interface RunProps {
  id: string
  onClick: () => void
}

export default function Run({ id, onClick }: RunProps) {
  const { profiles } = useProfileStore()
  const profile = find(profiles, { id })

  return (
    <Button
      color="success"
      icon="fa-solid fa-play"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      disabled={profile?.status === "running" || profile?.status === "wating-to-stop"}
    />
  )
}