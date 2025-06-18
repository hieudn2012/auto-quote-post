import Button from "@/components/Button";
import { windowInstance } from "@/types/window";
import { toast } from "react-toastify";
export default function SyncProfile() {
  const handleSyncProfile = () => {
    windowInstance.api.syncProfile().then(() => {
      toast.success("Sync profile success, please refresh page")
    })
  }

  return (
    <Button color="success" icon="fa-solid fa-sync" onClick={handleSyncProfile}>
      Sync Profile
    </Button>
  )
}