import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "", type: "user" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            let endpoint = form.type === "ngo"
                ? "http://localhost:5000/api/ngos/login"
                : "http://localhost:5000/api/auth/login";

            const res = await API.post(endpoint, {
                email: form.email,
                password: form.password,
            });

            // Save tokens
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            localStorage.setItem("userType", form.type);

            setMessage("Login successful!");
            navigate("/dashboard"); // Redirect to /home

        } catch (err) {
            setMessage(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="space-y-6">

                        {/* Account Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Account Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {["user", "ngo"].map((type) => (
                                    <div className="flex items-center" key={type}>
                                        <input
                                            id={type}
                                            type="radio"
                                            name="type"
                                            value={type}
                                            checked={form.type === type}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label htmlFor={type} className="ml-2 block text-sm text-gray-900">
                                            {type === "ngo" ? "NGO" : "User"}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition duration-150 ease-in-out ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    }`}
                            >
                                {loading ? "Signing in..." : `Sign in as ${form.type === "ngo" ? "NGO" : "User"}`}
                            </button>
                        </div>

                        {/* Links */}
                        <div className="flex items-center justify-between text-sm">
                            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot your password?
                            </Link>
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Create new account
                            </Link>
                        </div>

                        {/* Message */}
                        {message && (
                            <div className={`mt-4 p-4 rounded-md ${message.includes("successful")
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                            >
                                <p className="text-sm font-medium">{message}</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
