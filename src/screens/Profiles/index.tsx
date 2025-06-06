import { useGetProfiles } from "@/services/profile.service"
import Button from "@/components/Button"
import { Layout } from "@/components/Layout"
import { windowInstance } from "@/types/window"

export default function Profiles() {
  const { data, isLoading } = useGetProfiles()

  const runProfile = async (profileId: string) => {
    await windowInstance.api.runProfile(profileId)
  }

  const stopProfile = async (profileId: string) => {
    await windowInstance.api.stopProfile(profileId)
  }

  const sharePost = async (profileId: string) => {
    await windowInstance.api.sharePost(profileId)
  }

  return (
    <Layout>
      {isLoading && <div>Loading...</div>}
      <table className="w-full table-auto text-left">
        <thead>
          <tr>
            <th>Name</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((profile) => (
            <tr key={profile.id} className="border-b border-gray-200">
              <td className="py-2">{profile.name}</td>
              <td className="py-2">
                <div
                  dangerouslySetInnerHTML={{ __html: profile.notes }}
                />
              </td>
              <td className="py-2">
                Ready
              </td>
              <td className="py-2">
                <div className="flex gap-2">
                  <Button onClick={() => runProfile(profile.id)}>Run</Button>
                  <Button onClick={() => stopProfile(profile.id)}>Stop</Button>
                  <Button onClick={() => sharePost(profile.id)}>Share</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}