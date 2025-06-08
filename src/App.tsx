import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Dashboard from './screens/Dashboard'
import Profiles from './screens/Profiles'
import History from './screens/History'
import Error from './screens/Error'
import Setting from './screens/Setting'
import { RoutePath } from './components/Siderbar'
import { useEffect } from 'react'
import { windowInstance } from './types/window'
import useProfileStore from './store/profile.store'
import { useGetProfiles } from './services/profile.service'

function App() {
  const { setProfiles } = useProfileStore()
  const { data } = useGetProfiles()

  useEffect(() => {
    windowInstance.api.getSettings().then((settings) => {
      localStorage.setItem('settings', JSON.stringify(settings))
    })
  }, [])

  useEffect(() => {
    const profiles = data?.map(profile => ({
      id: profile.id,
      name: profile.name,
      status: "ready" as const
    }))
    setProfiles(profiles ?? [])
  }, [data, setProfiles])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Setting />} />
        <Route path={RoutePath.Profiles} element={<Profiles />} />
        <Route path={RoutePath.History} element={<History />} />
        <Route path={RoutePath.Error} element={<Error />} />
        <Route path={RoutePath.Settings} element={<Setting />} />
      </Routes>
    </Router>
  )
}

export default App
