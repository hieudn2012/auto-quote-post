import Button from "@/components/Button"
import { windowInstance } from "@/types/window"
import { useState } from "react"

interface ScanAnalyticsProps {
  ids: string[]
}

const MAX_PROFILES_PER_GROUP = 5

export default function ScanAnalytics({ ids }: ScanAnalyticsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentGroup, setCurrentGroup] = useState(0)
  const [totalGroups, setTotalGroups] = useState(0)

  const handleScanAnalytics = async () => {
    if (isProcessing) return
    
    setIsProcessing(true)
    setCurrentGroup(0)
    setTotalGroups(Math.ceil(ids.length / MAX_PROFILES_PER_GROUP))
    
    try {
      // Process profiles in groups of maximum 10
      for (let i = 0; i < ids.length; i += MAX_PROFILES_PER_GROUP) {
        const group = ids.slice(i, i + MAX_PROFILES_PER_GROUP)
        setCurrentGroup(Math.floor(i / MAX_PROFILES_PER_GROUP) + 1)
        
        // Process current group one by one with 3 seconds delay
        for (let j = 0; j < group.length; j++) {
          await windowInstance.api.captureAnalytics(group[j])
          
          // Wait 3 seconds before next profile (except for the last profile in group)
          if (j < group.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 3 * 1000)) // 3 seconds
          }
        }
        
        // Wait 2 minutes before processing next group (except for the last group)
        if (i + MAX_PROFILES_PER_GROUP < ids.length) {
          await new Promise(resolve => setTimeout(resolve, 1 * 60 * 1000)) // 1 minutes
        }
      }
    } catch (error) {
      console.error('Error scanning analytics:', error)
    } finally {
      setIsProcessing(false)
      setCurrentGroup(0)
      setTotalGroups(0)
    }
  }

  return (
    <Button 
      color="warning" 
      icon="fa-solid fa-chart-bar" 
      disabled={ids.length === 0 || isProcessing} 
      onClick={handleScanAnalytics}
    >
      {isProcessing 
        ? `Scanning... (Group ${currentGroup}/${totalGroups})` 
        : 'Scan Analytics'
      }
    </Button>
  )
}