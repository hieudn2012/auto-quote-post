import { useGetProfiles } from "@/services/profile.service"
import Button from "@/components/Button"
import { Layout } from "@/components/Layout"
import { windowInstance } from "@/types/window"
import { useState } from "react"
import Checkbox from "@/components/Checkbox"

export default function Profiles() {
  const { data, isLoading } = useGetProfiles()
  const [selectedProfile, setSelectedProfile] = useState<string[] | null>(null)

  const runProfile = async (profileId: string) => {
    await windowInstance.api.runProfile(profileId)
  }

  const stopProfile = async (profileId: string) => {
    await windowInstance.api.stopProfile(profileId)
  }

  const selectAllProfiles = (checked: boolean) => {
    if (checked) {
      const profileIds = data?.map(profile => profile.id) ?? []
      setSelectedProfile(profileIds)
    } else {
      setSelectedProfile(null)
    }
  }

  const selectProfile = (profileId: string) => {
    if (!selectedProfile) {
      setSelectedProfile([profileId])
      return
    }

    const isSelected = selectedProfile.includes(profileId)
    if (isSelected) {
      setSelectedProfile(selectedProfile.filter(id => id !== profileId))
    } else {
      setSelectedProfile([...selectedProfile, profileId])
    }
  }

  const runProfiles = async () => {
    for (const profileId of selectedProfile ?? []) {
      await runProfile(profileId)
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }

  const stopProfiles = async () => {
    for (const profileId of selectedProfile ?? []) {
      await stopProfile(profileId)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  return (
    <Layout>
      {isLoading && <div>Loading...</div>}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="text-sm text-gray-500">Selected: <strong>{selectedProfile?.length ?? 0}</strong></div>
        <div className="flex items-center gap-2">
          <Button color="warning" icon="fa-solid fa-play" onClick={runProfiles}>Run selected</Button>
          <Button color="error" icon="fa-solid fa-stop" onClick={stopProfiles}>Stop selected</Button>
        </div>
      </div>
      <table className="w-full table-auto text-left">
        <thead>
          <tr>
            <th>
              <Checkbox checked={selectedProfile?.length === data?.length} onChange={selectAllProfiles} />
            </th>
            <th>Name</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((profile) => (
            <tr key={profile.id} className="border-b border-gray-200">
              <td className="py-2">
                <Checkbox
                  checked={selectedProfile?.includes(profile.id) ?? false}
                  onChange={() => selectProfile(profile.id)}
                />
              </td>
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
                  <Button color="success" icon="fa-solid fa-play" onClick={() => runProfile(profile.id)}></Button>
                  <Button color="error" icon="fa-solid fa-stop" onClick={() => stopProfile(profile.id)}></Button>
                  {/* <Button icon="fa-solid fa-share" onClick={() => sharePost(profile.id)}>Share</Button> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}