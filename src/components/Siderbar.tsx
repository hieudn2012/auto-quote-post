import { useNavigate, useLocation } from "react-router-dom"
import { twMerge } from "tailwind-merge"
export enum RoutePath {
  // Dashboard = "/",
  Profiles = "/profiles",
  History = "/history",
  Error = "/error",
  Settings = "/settings",
  Analytics = "/analytics",
}

const sidebarItems = [
  // {
  //   label: "Dashboard",
  //   path: RoutePath.Dashboard,
  //   icon: "fas fa-home",
  // },
  {
    label: "Profiles",
    path: RoutePath.Profiles,
    icon: "fas fa-user",
  },
  {
    label: "History",
    path: RoutePath.History,
    icon: "fas fa-history",
  },
  // {
  //   label: "Error",
  //   path: RoutePath.Error,
  //   icon: "fas fa-exclamation-triangle",
  // },
  {
    label: "Settings",
    path: RoutePath.Settings,
    icon: "fas fa-cog",
  },
  // analytics
  {
    label: "Analytics",
    path: RoutePath.Analytics,
    icon: "fas fa-chart-bar",
  },
]

export const Siderbar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div>
      <div className="text-md p-2">
        <p className="font-bold text-center">Administrator</p>
      </div>
      <div className="border-b border-gray-200 mb-5" />
      {sidebarItems.map((item) => (
        <div
          key={item.path} className={twMerge("py-2 hover:text-primary cursor-pointer rounded-md flex items-center gap-2 transition-colors duration-200", pathname === item.path && "text-primary")}
          onClick={() => navigate(item.path)}
        >
          <div className="text-md w-5">
            <i className={item.icon}></i>
          </div>
          <div className="text-md">{item.label}</div>
        </div>
      ))}
    </div>
  )
}