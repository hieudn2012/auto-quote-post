import Button from "@/components/Button"
import { windowInstance } from "@/types/window"
interface ScanAnalyticsProps {
  ids: string[]
}

export default function ScanAnalytics({ ids }: ScanAnalyticsProps) {
  const handleScanAnalytics = () => {
    for (const id of ids) {
      windowInstance.api.captureAnalytics(id)
    }
  }

  return (
    <Button color="warning" icon="fa-solid fa-chart-bar" disabled={ids.length === 0} onClick={handleScanAnalytics}>
      Scan Analytics
    </Button>
  )
}