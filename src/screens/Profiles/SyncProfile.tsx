import Button from "@/components/Button";
import { windowInstance } from "@/types/window";

export default function SyncProfile() {
  const handleSyncProfile = () => {
    windowInstance.api.syncProfile().then((profiles) => {
      console.log(profiles)
    })
  }

  return (
    <Button color="success" icon="fa-solid fa-sync" onClick={handleSyncProfile}>
      Sync Profile
    </Button>
  )
}