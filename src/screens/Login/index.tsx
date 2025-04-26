import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/profiles')
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <input
        type="text"
        placeholder="Username"
        className="w-72 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow transition duration-200 bg-white text-gray-800"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-72 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow transition duration-200 bg-white text-gray-800"
      />
      <button
        onClick={handleLogin}
        className="w-72 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow transition duration-200 bg-white text-gray-800 font-bold">Login</button>
    </div>
  )
}
