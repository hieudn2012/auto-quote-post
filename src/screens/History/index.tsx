import { Layout } from "@/components/Layout";
import { useHistoryStore } from "@/store/history.store";
import { map } from "lodash";
import { Item } from "./Item";
import { Clear } from "./Clear";

export default function History() {
  const { history } = useHistoryStore()
  return (
    <Layout>
      <Clear />
      {map(history, (item, index) => (
        <Item key={index} item={item} />
      ))}
    </Layout>
  )
}