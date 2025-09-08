import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ArjunaLanding from './pages/LandingPage'
import Analysis from './pages/Analysis';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ArjunaLanding />} />
        <Route path='/analysis' element={<Analysis />} />
      </Routes>
    </Router>
  )
}

export default App
