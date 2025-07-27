import Button from "@/components/Button";
import { windowInstance } from "@/types/window";

interface ClearProps {
  onClear: () => void
}

export default function Clear({ onClear }: ClearProps) {
  const handleClear = () => {
    windowInstance.api.clearAnalytics()
    onClear()
  }
  return (
    <Button
      icon="fa-solid fa-trash"
      color="error"
      onClick={handleClear}
    >
      Clear
    </Button>
  )
}
