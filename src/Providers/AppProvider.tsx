import { useEffect } from "react"
import { useProvider } from "./useProvider"

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { loadApp } = useProvider()

  useEffect(() => {
    loadApp()
  }, [loadApp])

  return <>{children}</>
}
