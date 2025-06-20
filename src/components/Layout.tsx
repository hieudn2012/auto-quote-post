import { Siderbar } from "./Siderbar"

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="flex rounded-lg h-[calc(100vh-32px)] gap-2 overflow-hidden">
        <div className="w-64 bg-white p-4 rounded-lg">
          <Siderbar />
        </div>
        <div className="flex-1 bg-white rounded-lg">
          <div className="p-6 overflow-auto h-full fade-in">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
