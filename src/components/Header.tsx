import { useLocation } from "react-router-dom"
import { RoutePath } from "./Siderbar"

export const Header = () => {
  const location = useLocation()

  const mapLocationToTitle = (path: string) => {
    switch (path) {
      // case RoutePath.Dashboard:
      //   return "Dashboard"
      case RoutePath.Profiles:
        return "Profiles"
      case RoutePath.History:
        return "History"
      case RoutePath.Error:
        return "Error"
      case RoutePath.Settings:
        return "Settings"
    }
  }

  return (
    <div className="text-md font-bold">
      {mapLocationToTitle(location.pathname)}
    </div>
  )
}