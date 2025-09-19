// pages/NGOPage.jsx
export default function NGOPage() {
    const ngoListings = [
        { id: 1, title: "Green Mumbai Initiative", funds: "₹2,00,000 raised" },
        { id: 2, title: "Save Rivers Project", funds: "₹1,25,000 raised" },
    ];

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">🤝 NGO Fundraising</h2>
            <ul className="space-y-2">
                {ngoListings.map((ngo) => (
                    <li
                        key={ngo.id}
                        className="p-3 border rounded-lg flex justify-between bg-yellow-50"
                    >
                        <span>{ngo.title}</span>
                        <span className="text-sm text-gray-700">{ngo.funds}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
