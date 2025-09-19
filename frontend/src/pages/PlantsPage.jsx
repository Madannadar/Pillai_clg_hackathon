// pages/PlantsPage.jsx
export default function PlantsPage() {
    const plantedPlants = [
        { id: 1, name: "Neem Tree", status: "Growing well 🌱" },
        { id: 2, name: "Mango Tree", status: "Needs watering 💧" },
    ];

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">🌱 Your Planted Plants</h2>
            <ul className="space-y-2">
                {plantedPlants.map((plant) => (
                    <li
                        key={plant.id}
                        className="p-3 border rounded-lg flex justify-between bg-green-50"
                    >
                        <span>{plant.name}</span>
                        <span className="text-sm text-gray-700">{plant.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
