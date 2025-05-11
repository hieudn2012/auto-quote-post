import { useGetProfiles } from "@/services/profile.service"
import Button from "@/components/Button"
export default function Profiles() {
  const { data, isLoading } = useGetProfiles()

  const runProfile = async (profileId: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await window.api.runProfile(profileId)
  }

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      <table className="w-full table-auto text-left">
        <thead>
          <tr>
            <th>Name</th>
            <th>Proxy</th>
            <th>Region</th>
            <th>Custom Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((profile) => (
            <tr key={profile.id} className="border-b border-gray-200">
              <td className="py-2">{profile.name}</td>
              <td className="py-2">{profile.proxy.host}</td>
              <td className="py-2">{profile.proxy.autoProxyRegion}</td>
              <td className="py-2">{profile.proxy.customName}</td>
              <td className="py-2">
                <Button onClick={() => runProfile(profile.id)}>Run</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}