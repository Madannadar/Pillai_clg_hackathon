// import { useState } from "react";
import { useState } from "react";
import axios from "axios";

export default function CreateCampaign() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        targetAmount: "",
        endDate: "",
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Update input fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Update images
    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const ngoId = localStorage.getItem("ngoId");
            const token = localStorage.getItem("token");

            // FormData for file upload
            const data = new FormData();
            data.append("ngoId", ngoId);
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("targetAmount", formData.targetAmount);
            data.append("endDate", formData.endDate);

            images.forEach((file) => {
                data.append("images", file);
            });

            const res = await axios.post(
                "http://localhost:5000/api/campaigns/create", // ✅ updated endpoint
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage("Campaign created successfully!");
            setFormData({ title: "", description: "", targetAmount: "", endDate: "" });
            setImages([]);
        } catch (err) {
            console.error("Create campaign error:", err.response?.data || err.message);
            setMessage(err.response?.data?.error || "Failed to create campaign");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-8 mt-8 border border-green-100">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📢</span>
                </div>
                <h2 className="text-3xl font-bold text-green-900 mb-2">Create Campaign</h2>
                <p className="text-green-600">Start your fundraising journey for a greener future</p>
            </div>

            {message && (
                <div
                    className={`mb-6 p-4 rounded-lg border ${
                        message.includes("success") 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <span>{message.includes("success") ? "✅" : "❌"}</span>
                        <span className="font-medium">{message}</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-green-800">Campaign Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter a compelling campaign title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-green-800">Description</label>
                    <textarea
                        name="description"
                        placeholder="Describe your campaign goals and impact"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        rows={4}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-green-800">Target Amount (₹)</label>
                        <input
                            type="number"
                            name="targetAmount"
                            placeholder="50000"
                            value={formData.targetAmount}
                            onChange={handleChange}
                            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-green-800">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-green-800">Campaign Images</label>
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                        <input
                            type="file"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <div className="text-green-600 mb-2">
                                <svg className="mx-auto w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <p className="text-green-600 font-medium">Click to upload images</p>
                            <p className="text-green-500 text-sm mt-1">PNG, JPG up to 10MB each</p>
                        </label>
                    </div>
                    {images.length > 0 && (
                        <p className="text-sm text-green-600">
                            {images.length} image(s) selected
                        </p>
                    )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <span className="text-yellow-600">⚠️</span>
                        <div>
                            <h4 className="font-medium text-yellow-800">Verification Required</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                Your campaign will need admin verification before it can accept donations. This ensures quality and builds donor trust.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-6 text-white font-medium rounded-lg transition-all ${
                        loading 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Campaign...
                        </div>
                    ) : (
                        "Create Campaign 🚀"
                    )}
                </button>
            </form>
        </div>
    );
}
