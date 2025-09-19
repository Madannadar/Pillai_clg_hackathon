import React from "react";
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
import NGODashboard from './pages/NogDashboard';
import ProfilePage from './pages/ProfilePage';
import NGOPage from './pages/NGOPage';
import PlantsPage from './pages/PlantsPage';
import WeatherPage from './pages/WeatherPage';


const App = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken");


  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<ArjunaLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<NGODashboard />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/ngos' element={<NGOPage />} />
        <Route path='/plants' element={<PlantsPage />} />
        <Route path='/weather' element={<WeatherPage />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
