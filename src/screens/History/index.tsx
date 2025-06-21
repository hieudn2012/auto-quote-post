import { Layout } from "@/components/Layout";
import { useHistoryStore } from "@/store/history.store";
import { map } from "lodash";
import { Name } from "./Name";
export default function History() {
  const { history } = useHistoryStore()
  return (
    <Layout>
      {map(history, (item, index) => (
        <div key={index} className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-4">
          <Name id={item.profile_id} />
          <div>{item.post_url}</div>
          <div>{item.created_at}</div>
        </div>
      ))}
    </Layout>
  )
}