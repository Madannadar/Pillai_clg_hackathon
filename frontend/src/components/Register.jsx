import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    type: "user",
    // NGO specific fields
    registrationNumber: "",
    contactNumber: "",
    address: "",
    website: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let endpoint, data;

      if (form.type === "ngo") {
        endpoint = "http://localhost:5000/api/ngos/register";
        data = {
          name: form.name,
          email: form.email,
          password: form.password,
          registrationNumber: form.registrationNumber,
          contactNumber: form.contactNumber,
          address: form.address,
          website: form.website
        };
      } else {
        endpoint = "http://localhost:5000/api/auth/register";
        data = {
          name: form.name,
          email: form.email,
          password: form.password
        };
      }

      const res = await API.post(endpoint, data);
      setMessage(res.data.message);

      // Optional: Redirect after registration
      if (res.status === 201) navigate("/dashboard");

    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center">
                  <input
                    id="user-reg"
                    type="radio"
                    name="type"
                    value="user"
                    checked={form.type === "user"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="user-reg" className="ml-2 block text-sm text-gray-900">User</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="ngo-reg"
                    type="radio"
                    name="type"
                    value="ngo"
                    checked={form.type === "ngo"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="ngo-reg" className="ml-2 block text-sm text-gray-900">NGO</label>
                </div>
              </div>
            </div>

            {/* Common Fields */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {form.type === "ngo" ? "NGO Name" : "Full Name"}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder={form.type === "ngo" ? "Enter NGO name" : "Enter full name"}
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* NGO Fields */}
            {form.type === "ngo" && (
              <>
                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
                  <input
                    id="registrationNumber"
                    name="registrationNumber"
                    type="text"
                    required
                    placeholder="Enter government registration number"
                    value={form.registrationNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    placeholder="Enter contact number"
                    value={form.contactNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    placeholder="Enter complete address"
                    value={form.address}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website (Optional)</label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://yourwebsite.org"
                    value={form.website}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </>
            )}

            {/* Submit */}
            <div>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition duration-150 ease-in-out ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
              >
                {loading ? "Creating Account..." : `Create ${form.type === "ngo" ? "NGO" : "User"} Account`}
              </button>
            </div>

            <div className="mt-2 text-center text-sm">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Already have an account? Login
              </Link>
            </div>

            {/* Message */}
            {message && (
              <div className={`mt-4 p-4 rounded-md ${message.includes("successful") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
