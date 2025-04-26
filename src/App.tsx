import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from './screens/Login'
import Profiles from './screens/Profiles'

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/profiles">Profiles</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profiles" element={<Profiles />} />
      </Routes>
    </Router>
  )
}

export default App
