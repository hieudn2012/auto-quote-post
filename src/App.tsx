import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Dashboard from './screens/Dashboard'
import Profiles from './screens/Profiles'
import History from './screens/History'
import Error from './screens/Error'
import Setting from './screens/Setting'
import { RoutePath } from './components/Siderbar'

function App() {
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
