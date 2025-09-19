// pages/ProfilePage.jsx
export default function ProfilePage() {
    const user = {
        name: "Madan Nadar",
        email: "madan@example.com",
        joined: "Jan 2025",
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">👤 User Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Joined:</strong> {user.joined}</p>
        </div>
    );
}
