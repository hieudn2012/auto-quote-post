import Button from "@/components/Button"
import { Name } from "./Name"
import { History } from "@/types/window"
import { formatPostDate, shortenString } from "@/utils/string"

export const Item = ({ item }: { item: History }) => {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-gray-200 py-4">
      <Name id={item.profile_id} />
      <div className="flex items-center gap-2">
        <span>{shortenString(item.post_url)}</span>
        <Button icon="fa-solid fa-copy" onClick={() => navigator.clipboard.writeText(item.post_url)} />
      </div>
      <div>{formatPostDate(item.created_at)}</div>
    </div>
  )
}