import Button from "@/components/Button"
import { Layout } from "@/components/Layout"
import { windowInstance } from "@/types/window"
import { useEffect, useState, useCallback } from "react"
import useProfileStore from "@/store/profile.store"
import { IpcRendererEvent } from "electron"
import Item from "./Item"
import SettingModal from "./SettingModal"
import { SmartSettings } from "./SmartSettings"
import SmartSettingModal from "./SmartSettingModal"
import SyncProfile from "./SyncProfile"
import { filter, map, sortBy } from "lodash"
import { Folders } from "./Folders"
import useSettingStore from "@/store/setting.store"
import { Column, CustomShowColumn } from "./CustomShowColumn"
import ScanAnalytics from "./ScanAnalytics"
import Post from "./Post"
export default function Profiles() {
  const { settings } = useSettingStore()
  const { profiles } = useProfileStore()
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const [selectedProfile, setSelectedProfile] = useState<string[] | null>(null)
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false)
  const [isSmartSettingModalOpen, setIsSmartSettingModalOpen] = useState(false)
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [checkedColumns, setCheckedColumns] = useState<Column[]>([Column.NAME, Column.NOTES, Column.PROXY, Column.GROUP, Column.LAST_POST])

  // Memoize các hàm callback để tránh tạo function mới mỗi lần render
  const runProfile = useCallback(async (profileId: string) => {
    await windowInstance.api.runProfile(profileId)
  }, [])

  const stopProfile = useCallback(async (profileId: string) => {
    await windowInstance.api.stopProfile(profileId)
  }, [])

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

  const listProfiles = filter(profiles, (profile) => selectedFolder === "" ? true : profile.folders.includes(selectedFolder))
  const sortByName = sortBy(listProfiles, 'name').reverse()

  const selectAllProfiles = useCallback(() => {
    setSelectedProfile(map(listProfiles, 'id'))
  }, [listProfiles])

  const unselectAllProfiles = useCallback(() => {
    setSelectedProfile([])
  }, [])

  useEffect(() => {
    const handler = (_event: IpcRendererEvent, data: { profileId: string; message: string }) => {
      const messageElement = document.getElementById(`profile-message-${data.profileId}`)
      if (messageElement) {
        messageElement.innerHTML = data.message
      }
      if (data.message.includes('Done! 🎉')) {
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
  }, [])


  return (
    <Layout>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="text-sm text-gray-500">Selected: <strong>{selectedProfile?.length ?? 0}</strong></div>
        <div className="flex items-center gap-2">
          <SyncProfile />
          <ScanAnalytics ids={selectedProfile ?? []} />
          <SmartSettings onClick={() => setIsSmartSettingModalOpen(true)} />
          <Button color="success" icon="fa-solid fa-share-nodes" onClick={runProfiles}>Quote</Button>
          <Post ids={selectedProfile ?? []} />
          <Button color="error" icon="fa-solid fa-stop" onClick={stopProfiles}>Stop selected</Button>
        </div>
      </div>

      <div className="mb-2">
        <Folders profiles={profiles} selectedFolder={selectedFolder} onSelect={setSelectedFolder} />
      </div>
      <div className="mb-2 flex justify-end">
        <CustomShowColumn checkedColumns={checkedColumns} onApply={setCheckedColumns} />
      </div>

      <div className="flex gap-2 mb-2">
        <Button icon="fa-solid fa-check" color="success" onClick={selectAllProfiles}>Select all</Button>
        <Button icon="fa-solid fa-xmark" color="error" onClick={unselectAllProfiles}>Unselect all</Button>
      </div>

      <div className="flex flex-col gap-2">
        {map(sortByName, (profile) => (
          <Item
            key={profile.id}
            profile={profile} selected={selectedProfile?.includes(profile.id) ?? false}
            onSelect={() => selectProfile(profile.id)}
            onRun={() => runProfile(profile.id)}
            onStop={() => stopProfile(profile.id)}
            onSetting={() => {
              setSelectedProfileId(profile.id)
              setIsSettingModalOpen(true)
            }}
            settings={settings}
            checkedColumns={checkedColumns}
          />
        ))}
      </div>
      <SettingModal isOpen={isSettingModalOpen} onClose={() => setIsSettingModalOpen(false)} profile_id={selectedProfileId ?? ""} />
      <SmartSettingModal isOpen={isSmartSettingModalOpen} onClose={() => setIsSmartSettingModalOpen(false)} profile_ids={selectedProfile ?? []} />
    </Layout>
  )
}