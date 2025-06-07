import { Layout } from "@/components/Layout";
import { windowInstance } from "@/types/window";
import { useEffect, useState } from "react";
import { split } from "lodash";
export default function Error() {
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const fetchErrors = async () => {
      const errors = await windowInstance.api.getAllError()
      setErrors(errors)
    }
    fetchErrors()
  }, [])

  return (
    <Layout>
      <table className="w-full table-auto text-left">
        <thead>
          <tr>
            <th>Index</th>
            <th>Profile</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((error, index) => (
            <tr key={error}>
              <td>{index + 1}</td>
              <td>{split(error, '||')[0]}</td>
              <td>{split(error, '||')[1]}</td>
              <td>{split(error, '||')[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}