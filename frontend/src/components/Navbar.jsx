// components/Navbar.jsx
import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-green-700 shadow-md text-white px-6 py-4 flex justify-between items-center">
            {/* Logo / Title */}
            <h1 className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
                🌍 <span className="hidden sm:inline">User Dashboard</span>
            </h1>

            {/* Links */}
            <div className="flex gap-4 sm:gap-6">
                <NavLink
                    to="weather"
                    className={({ isActive }) =>
                        `px-3 py-1 rounded-lg transition-colors duration-200 ${isActive
                            ? "bg-white text-green-700 font-semibold"
                            : "hover:bg-green-600"
                        }`
                    }
                >
                    Weather
                </NavLink>
                <NavLink
                    to="plants"
                    className={({ isActive }) =>
                        `px-3 py-1 rounded-lg transition-colors duration-200 ${isActive
                            ? "bg-white text-green-700 font-semibold"
                            : "hover:bg-green-600"
                        }`
                    }
                >
                    My Plants
                </NavLink>
                <NavLink
                    to="ngos"
                    className={({ isActive }) =>
                        `px-3 py-1 rounded-lg transition-colors duration-200 ${isActive
                            ? "bg-white text-green-700 font-semibold"
                            : "hover:bg-green-600"
                        }`
                    }
                >
                    NGOs
                </NavLink>
                <NavLink
                    to="profile"
                    className={({ isActive }) =>
                        `px-3 py-1 rounded-lg transition-colors duration-200 ${isActive
                            ? "bg-white text-green-700 font-semibold"
                            : "hover:bg-green-600"
                        }`
                    }
                >
                    Profile
                </NavLink>
            </div>
        </nav>
    );
}
