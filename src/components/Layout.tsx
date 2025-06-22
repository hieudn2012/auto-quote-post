import { Siderbar } from "./Siderbar"

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex rounded-lg h-[calc(100vh-32px)] gap-2">
        <div className="w-64 bg-gradient-to-b from-white to-gray-50 p-4 rounded-lg shadow-lg">
          <Siderbar />
        </div>
        <div className="flex-1 bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-lg shadow-lg">
          <div className="p-6 overflow-auto h-full fade-in">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
