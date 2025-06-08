import useProfileStore from "@/store/profile.store"
import { find } from "lodash"
import { useEffect } from "react"
import { useState } from "react"

export default function ProfileName({ id }: { id: string }) {
  const [name, setName] = useState<string | null>(null)
  const { profiles } = useProfileStore()

  useEffect(() => {
    const profile = find(profiles, (p) => p.id.toLowerCase() === id.toLowerCase())
    setName(profile?.name ?? null)
  }, [profiles, id])

  return <div className="text-sm text-gray-500">{name}</div>
}
