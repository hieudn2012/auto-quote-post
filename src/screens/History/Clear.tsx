import { useState } from "react"
import Button from "@/components/Button"
import { Select } from "@/components/Select"
import { ClearHistoryType, windowInstance } from "@/types/window"

const options = [
  {
    label: "All",
    value: ClearHistoryType.ALL,
  },
  {
    label: "Today",
    value: ClearHistoryType.TODAY,
  },
  {
    label: "Yesterday",
    value: ClearHistoryType.YESTERDAY,
  },
  {
    label: "Last 3 days",
    value: ClearHistoryType.LAST_3_DAYS,
  },
  {
    label: "Last 7 days",
    value: ClearHistoryType.LAST_7_DAYS,
  },
  {
    label: "Last 30 days",
    value: ClearHistoryType.LAST_30_DAYS,
  },
  {
    label: "Last 60 days",
    value: ClearHistoryType.LAST_60_DAYS,
  },
]
export const Clear = () => {
  const [selected, setSelected] = useState<ClearHistoryType>(ClearHistoryType.LAST_3_DAYS)

  const handleClear = () => {
    windowInstance.api.clearHistory(selected)
  }

  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-2 w-[400px]">
        <Select
          options={options}
          value={selected}
          onChange={(value) => setSelected(value as ClearHistoryType)}
        />
        <Button
          icon="fa-solid fa-trash"
          size="large"
          color="error"
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}