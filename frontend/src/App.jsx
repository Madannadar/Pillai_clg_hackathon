import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ArjunaLanding from "./pages/LandingPage";
import Analysis from "./pages/Analysis";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";
import Weather from "./pages/WeatherPage";
import MyPlants from "./pages/PlantsPage";
import NGODashboard from "./pages/NogDashboard";
import Profile from "./pages/ProfilePage";

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<ArjunaLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/analysis" element={<Analysis />} />

        {/* Protected routes matching Navbar */}
        <Route
          path="/weather"
          element={
            <ProtectedRoute>
              <Weather />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plants"
          element={
            <ProtectedRoute>
              <MyPlants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngos"
          element={
            <ProtectedRoute>
              <NGODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
