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
import Planting from './pages/Planting';
import WeatherPage from './pages/WeatherPage';
import DonatePage from "./components/DonatePage";
import CreateCampaign from "./components/CreateCampaign";
import AdminPage from "./pages/AdminPage";


const App = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const userType = localStorage.getItem("userType");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin" || userType === "admin";


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
        <Route path='/planting' element={<Planting />} />
        <Route path='/weather' element={<WeatherPage />} />
        <Route path="/donate/:campaignId" element={<DonatePage />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
        <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/login" />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
