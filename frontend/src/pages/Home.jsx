import { useEffect, useState } from "react";
import API from "../services/api";

export default function Home() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessage("You are logged in!");
    }, []);

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        await API.post("/logout", { refreshToken });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
    };

    return (
        <div>
            <h2>Home</h2>
            <p>{message}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
