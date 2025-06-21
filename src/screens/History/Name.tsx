import { useGetProfileById } from "@/services/profile.service"

interface NameProps {
  id: string;
}

export const Name = ({ id }: NameProps) => {
  const profile = useGetProfileById(id)

  return <div>{profile?.name}</div>
}