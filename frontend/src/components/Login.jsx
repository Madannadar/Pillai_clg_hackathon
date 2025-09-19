import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/login", form);
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            setMessage("Login successful!");
            navigate("/home");
        } catch (err) {
            setMessage(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
