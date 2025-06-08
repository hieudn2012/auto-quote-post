import { useGetProfiles } from "@/services/profile.service"
import Button from "@/components/Button"
import { Layout } from "@/components/Layout"
import { windowInstance } from "@/types/window"
import { useEffect, useState, useCallback } from "react"
import Checkbox from "@/components/Checkbox"
import useProfileStore from "@/store/profile.store"
import ProfileStatus from "@/components/ProfileStatus"
import Stop from "./Stop"
import Run from "./Run"
import { IpcRendererEvent } from "electron"

export default function Profiles() {
  console.log('Profiles component rendering')
  const { data, isLoading } = useGetProfiles()
  const [selectedProfile, setSelectedProfile] = useState<string[] | null>(null)
  const { updateProfileStatus } = useProfileStore()

  // Memoize các hàm callback để tránh tạo function mới mỗi lần render
  const runProfile = useCallback(async (profileId: string) => {
    await windowInstance.api.runProfile(profileId)
    updateProfileStatus(profileId, "running")
  }, [updateProfileStatus])

  const stopProfile = useCallback(async (profileId: string) => {
    await windowInstance.api.stopProfile(profileId)
    updateProfileStatus(profileId, "wating-to-stop")
    await new Promise(resolve => setTimeout(resolve, 10000))
    updateProfileStatus(profileId, "stopped")
  }, [updateProfileStatus])

  const selectAllProfiles = useCallback((checked: boolean) => {
    if (checked) {
      const profileIds = data?.map(profile => profile.id) ?? []
      setSelectedProfile(profileIds)
    } else {
      setSelectedProfile(null)
    }
  }, [data])

  const selectProfile = useCallback((profileId: string) => {
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
  }, [selectedProfile])

  const runProfiles = useCallback(async () => {
    for (const profileId of selectedProfile ?? []) {
      await runProfile(profileId)
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }, [selectedProfile, runProfile])

  const stopProfiles = useCallback(async () => {
    for (const profileId of selectedProfile ?? []) {
      await stopProfile(profileId)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }, [selectedProfile, stopProfile])

  useEffect(() => {
    console.log('Effect running - data changed:', data)
    const handler = (_event: IpcRendererEvent, data: { profileId: string; message: string }) => {
      const messageElement = document.getElementById(`profile-message-${data.profileId}`)
      if (messageElement) {
        messageElement.innerHTML = data.message
      }
      if (data.message.includes('Close pages')) {
        if (messageElement) {
          messageElement.style.fontWeight = 'bold'
          messageElement.style.color = 'red'
        }
      }
    }
    windowInstance?.ipcRenderer?.on('profile-status', handler)
    return () => {
      windowInstance?.ipcRenderer?.off('profile-status', handler)
    }
  }, [data]) // Thêm data vào dependency array để xem nó có phải nguyên nhân không

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
            <th className="p-2">
              <Checkbox checked={selectedProfile?.length === data?.length} onChange={selectAllProfiles} />
            </th>
            <th className="p-2">Name</th>
            <th className="p-2">Notes</th>
            <th className="p-2">Port</th>
            <th className="p-2 w-[150px]">Status</th>
            <th className="p-2 w-1/4">Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((profile) => (
            <tr key={profile.id} className="border-b border-gray-200 text-sm">
              <td className="p-2">
                <Checkbox
                  checked={selectedProfile?.includes(profile.id) ?? false}
                  onChange={() => selectProfile(profile.id)}
                />
              </td>
              <td className="p-2">{profile.name}</td>
              <td className="p-2">
                <div
                  dangerouslySetInnerHTML={{ __html: profile.notes }}
                />
              </td>
              <td className="p-2">{profile.proxy.port}</td>
              <td className="p-2">
                <ProfileStatus id={profile.id} />
              </td>
              <td className="p-2 text-sm">
                <span id={`profile-message-${profile.id}`}></span>
              </td>
              <td className="p-2">
                <div className="flex gap-2">
                  <Run id={profile.id} onClick={() => runProfile(profile.id)} />
                  <Stop onClick={() => stopProfile(profile.id)} />
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