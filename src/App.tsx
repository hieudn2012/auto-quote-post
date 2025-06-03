import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Login from './screens/Login'
import Profiles from './screens/Profiles'
import React from 'react'
import Token from './components/Token'

function App() {
  return (
    <React.Fragment>
      <div className='pb-10'>
        <Token />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Profiles />} />
        </Routes>
      </Router>
    </React.Fragment>
  )
}

export default App
