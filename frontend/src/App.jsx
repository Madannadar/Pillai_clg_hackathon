import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ArjunaLanding from './pages/LandingPage'
import Analysis from './pages/Analysis';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';


const App = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken");

  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ArjunaLanding />} />
        <Route path='/analysis' element={<Analysis />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
