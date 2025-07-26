import { useState } from "react";
import Button from "@/components/Button";
import { windowInstance } from "@/types/window";
import { toastSuccess } from "@/components/Toast";
import { useProvider } from "@/Providers/useProvider";
export default function SyncProfile() {
  const { loadApp } = useProvider()
  const [isLoading, setIsLoading] = useState(false)
  const handleSyncProfile = async () => {
    setIsLoading(true)
    await windowInstance.api.syncProfile().then(() => {
      toastSuccess("Sync profile success, loading app...")
      loadApp()
    })
    setIsLoading(false)
  }

  return (
    <Button color="success" icon="fa-solid fa-sync" onClick={handleSyncProfile} loading={isLoading}>
      Sync Profile
    </Button>
  )
}