import Button from "@/components/Button";
import { windowInstance } from "@/types/window";
import { toastSuccess } from "@/components/Toast";
import { useProvider } from "@/Providers/useProvider";

export default function SyncProfile() {
  const { loadApp } = useProvider()
  const handleSyncProfile = () => {
    windowInstance.api.syncProfile().then(() => {
      toastSuccess("Sync profile success, loading app...")
      loadApp()
    })
  }

  return (
    <Button color="success" icon="fa-solid fa-sync" onClick={handleSyncProfile}>
      Sync Profile
    </Button>
  )
}