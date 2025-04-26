import { useGetProfiles } from "@/services/profile.service"
import Button from "@/components/Button"
export default function Profiles() {
  const { data, isLoading } = useGetProfiles()

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
            <tr key={profile.id}>
              <td>{profile.name}</td>
              <td>{profile.proxy.host}</td>
              <td>{profile.proxy.autoProxyRegion}</td>
              <td>{profile.proxy.customName}</td>
              <td>
                <Button>Run</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}