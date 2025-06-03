import { useState } from "react"

export default function Token() {
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '')

  const handleLoadProfiles = () => {
    localStorage.setItem('token', token)
  }

  return (
    <div className="flex gap-2">
      <div className="max-w-[400px]">
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Token"
          className="w-full bg-transparent px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        onClick={handleLoadProfiles}
        className="bg-blue-500 text-white px-4 py-2 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        Load profiles
      </button>
    </div>
  )
}