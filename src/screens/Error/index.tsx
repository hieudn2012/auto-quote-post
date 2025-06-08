import { Layout } from "@/components/Layout";
import { windowInstance } from "@/types/window";
import { useEffect, useState } from "react";
import { map, sortBy, split } from "lodash";
import moment from "moment";
import ProfileName from "@/components/ProfileName";

interface ErrorType {
  profileId: string
  message: string
  date: string
}

export default function Error() {
  const [errors, setErrors] = useState<ErrorType[]>([])
  useEffect(() => {
    const fetchErrors = async () => {
      const errors = await windowInstance.api.getAllError()
      const result = map(errors, (error) => {
        return {
          profileId: split(error, '||')[0].trim(),
          message: split(error, '||')[1],
          date: split(error, '||')[2]
        }
      })
      const sorted = sortBy(result, 'date').reverse()
      setErrors(sorted)
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
          {map(errors, (error, index) => {
            return (
              <tr key={error.profileId}>
                <td>{index + 1}</td>
                <td>
                  <ProfileName id={error.profileId} />
                </td>
                <td>{error.message}</td>
                <td>
                  <p className="text-nowrap">{moment(error.date).format('HH:mm:ss DD/MM/YYYY')}</p>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Layout>
  )
}