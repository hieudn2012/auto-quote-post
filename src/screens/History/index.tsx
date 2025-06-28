import { Layout } from "@/components/Layout";
import { useHistoryStore } from "@/store/history.store";
import { filter, find, map, uniq } from "lodash";
import { Item } from "./Item";
import { Clear } from "./Clear";
import { useState } from "react";
import { MultipleSelect } from "@/components/MultipleSelect";
import useProfileStore from "@/store/profile.store";

export default function History() {
  const { history } = useHistoryStore()
  const { profiles } = useProfileStore()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const user_ids = uniq(map(history, "profile_id"))
  const options = map(user_ids, (user_id) => ({
    label: find(profiles, { id: user_id })?.name || user_id,
    value: user_id,
  }))

  const filteredHistory = selectedIds.length > 0 ? filter(history, (item) => {
    return selectedIds.includes(item.profile_id)
  }) : history

  return (
    <Layout>
      <div className="flex items-center justify-between gap-2">
        <div className="w-[200px]">
          <MultipleSelect
            options={options}
            value={selectedIds}
            onChange={(value) => {
              setSelectedIds(value)
            }}
            placeholder="Select users"
          />
        </div>
        <Clear />
      </div>
      {map(filteredHistory, (item, index) => (
        <Item key={index} item={item} />
      ))}
    </Layout>
  )
}