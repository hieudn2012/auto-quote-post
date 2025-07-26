import { Layout } from "@/components/Layout"
import { useEffect, useState } from "react"
import { windowInstance } from "@/types/window"
import { Analytics } from "@/types/window"
import { map } from "lodash"
import ProfileName from "@/components/ProfileName"
import Preview from "./Preview"

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics[]>([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewSrc, setPreviewSrc] = useState('')

  useEffect(() => {
    windowInstance.api.getAnalytics().then((analytics) => {
      setAnalytics(analytics)
    })
  }, [])
  return (
    <Layout>
      <div className="grid grid-cols-4 gap-4">
        {map(analytics, (analytics) => (
          <div key={analytics.profile_id} className="flex flex-col items-center justify-center gap-2">
            <img
              src={`data:image/jpeg;base64,${analytics.screenshot}`}
              alt={analytics.profile_id}
              className="w-full h-full object-contain rounded-md"
              onClick={() => {
                setIsPreviewOpen(true)
                setPreviewSrc(`data:image/jpeg;base64,${analytics.screenshot}`)
              }}
            />

            <div className="font-bold text-md">
              <ProfileName id={analytics.profile_id} />
            </div>
          </div>
        ))}
      </div>
      <Preview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        src={previewSrc}
      />
    </Layout>
  )
}