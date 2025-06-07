import { useNavigate } from "react-router-dom"

export enum RoutePath {
  // Dashboard = "/",
  Profiles = "/profiles",
  History = "/history",
  Error = "/error",
  Settings = "/settings",
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
  {
    label: "Error",
    path: RoutePath.Error,
    icon: "fas fa-exclamation-triangle",
  },
  {
    label: "Settings",
    path: RoutePath.Settings,
    icon: "fas fa-cog",
  },
]

export const Siderbar = () => {
  const navigate = useNavigate()

  return (
    <div>
      {sidebarItems.map((item) => (
        <div
          key={item.path} className="py-2 px-4 hover:bg-gray-700 cursor-pointer rounded-md flex items-center gap-2"
          onClick={() => navigate(item.path)}
        >
          <div className="text-xl w-7">
            <i className={item.icon}></i>
          </div>
          <div className="text-md font-bold">{item.label}</div>
        </div>
      ))}
    </div>
  )
}