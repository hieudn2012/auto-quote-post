import { Siderbar } from "./Siderbar"

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-blue-100 via-indigo-100 to-purple-100">
      <div className="flex rounded-lg h-[calc(100vh-32px)] gap-2">
        <div className="w-64 p-4 bg-white bg-opacity-75 rounded-lg shadow-lg">
          <Siderbar />
        </div>
        <div className="flex-1 bg-white bg-opacity-75 rounded-lg shadow-lg">
          <div className="p-6 overflow-auto h-full fade-in">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
