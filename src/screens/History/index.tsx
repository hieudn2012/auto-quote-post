import { Layout } from "@/components/Layout";
import { useHistoryStore } from "@/store/history.store";
import { map } from "lodash";
import { Item } from "./Item";

export default function History() {
  const { history } = useHistoryStore()
  return (
    <Layout>
      {map(history, (item, index) => (
        <Item key={index} item={item} />
      ))}
    </Layout>
  )
}