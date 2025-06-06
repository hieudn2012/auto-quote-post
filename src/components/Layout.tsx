import { Header } from "./Header"
import { Siderbar } from "./Siderbar"

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <Siderbar />
      </div>
      <div className="flex-1 h-screen">
        <div className="h-16 bg-white shadow-md px-6 flex items-center">
          <Header />
        </div>
        <div className="p-6 h-[calc(100vh-64px)] w-[calc(100vw-256px)] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
