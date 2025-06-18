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
import Item from "./Item"
import SettingModal from "./SettingModal"

export default function Profiles() {
  const { data, isLoading } = useGetProfiles()
  const [selectedProfile, setSelectedProfile] = useState<string[] | null>(null)
  const { updateProfileStatus } = useProfileStore()
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false)
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
      if (data.message.includes('Done! 🎉')) {
        updateProfileStatus(data.profileId, "done")
        if (messageElement) {
          messageElement.style.fontWeight = 'bold'
          messageElement.style.color = 'green'
        }
      } else {
        if (messageElement) {
          messageElement.style.fontWeight = 'normal'
          messageElement.style.color = 'inherit'
        }
      }
    }
    windowInstance?.ipcRenderer?.on('profile-status', handler)
    return () => {
      windowInstance?.ipcRenderer?.off('profile-status', handler)
    }
  }, [data, updateProfileStatus])

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

      <div className="flex flex-col gap-2">
        {data?.map((profile) => (
          <Item
            key={profile.id}
            profile={profile} selected={selectedProfile?.includes(profile.id) ?? false}
            onSelect={() => selectProfile(profile.id)}
            onRun={() => runProfile(profile.id)}
            onStop={() => stopProfile(profile.id)}
            onSetting={() => setIsSettingModalOpen(true)}
          />
        ))}
      </div>
      <SettingModal isOpen={isSettingModalOpen} onClose={() => setIsSettingModalOpen(false)} />
    </Layout>
  )
}