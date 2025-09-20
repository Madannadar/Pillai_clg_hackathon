import { useState } from "react";
import { Button } from "../components/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import { Progress } from "../components/progress";
import { MapPin, Leaf, CheckCircle, Clock, TreePine, Droplets, Sun, Thermometer } from "lucide-react";
import PlantyMascot from "../components/PlantyMascot";

const Planting = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [plantingStage, setPlantingStage] = useState("location");
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState("");
    
    // --- NEW: State to control visibility of sample locations ---
    const [showLocations, setShowLocations] = useState(false);

    const locations = [
        { id: "1", name: "Central Park Area", distance: "0.5 km", greeneryLevel: "Low", recommended: true },
        { id: "2", name: "Riverside Gardens", distance: "1.2 km", greeneryLevel: "Medium", recommended: false },
        { id: "3", name: "Community Center", distance: "0.8 km", greeneryLevel: "Very Low", recommended: true },
    ];

    const recommendedPlants = [
        { id: "1", name: "Oak Tree", difficulty: "Easy", survivalRate: "95%", growthTime: "2-3 years", benefits: ["Air purification", "Wildlife habitat", "Shade provider"], conditions: { sunlight: "Full Sun", water: "Medium", soil: "Well-drained" } },
        { id: "2", name: "Maple Tree", difficulty: "Medium", survivalRate: "88%", growthTime: "3-4 years", benefits: ["Seasonal beauty", "Carbon absorption", "Urban cooling"], conditions: { sunlight: "Partial Sun", water: "High", soil: "Moist" } },
        { id: "3", name: "Pine Tree", difficulty: "Easy", survivalRate: "92%", growthTime: "1-2 years", benefits: ["Year-round greenery", "Air cleaning", "Erosion control"], conditions: { sunlight: "Full Sun", water: "Low", soil: "Sandy" } },
    ];

    const plantingSteps = [
        { step: 1, title: "Prepare the Site", description: "Clear the area and dig a hole twice the width of the root ball", completed: false },
        { step: 2, title: "Place the Plant", description: "Gently remove from container and place in hole", completed: false },
        { step: 3, title: "Backfill & Water", description: "Fill with soil and water thoroughly", completed: false },
        { step: 4, title: "Final Setup", description: "Add mulch and stake if necessary", completed: false },
    ];

    const handleLocationRequest = () => {
        setLocationError("");
        setUserLocation(null);
        setShowLocations(false); // Hide locations on new request

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lon: longitude });
                
                // --- CONSOLE LOG and SHOW LOCATIONS ---
                console.log(`Location found: Lat: ${latitude}, Lon: ${longitude}`);
                setShowLocations(true); // <-- This reveals the sample locations
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError("You denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        setLocationError("The request to get user location timed out.");
                        break;
                    default:
                        setLocationError("An unknown error occurred.");
                        break;
                }
            }
        );
    };

    return (
        <div className="min-h-screen bg-green-500">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in-up">
                    <h1 className="text-4xl font-bold text-foreground mb-4 ">Plant Your Impact</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Choose the perfect location and plant to create a greener future for your community
                    </p>
                    <div className="flex justify-center mt-6">
                        <PlantyMascot
                            message={
                                plantingStage === "location"
                                    ? "Let's find the perfect spot for your tree! 🗺️"
                                    : plantingStage === "plant-selection"
                                    ? "Great choice! Now pick your perfect plant buddy! 🌳"
                                    : plantingStage === "instructions"
                                    ? "Follow these steps and your plant will thrive! 📋"
                                    : "You're almost there! Time to make your impact! 🎉"
                            }
                            animation="float"
                            size="lg"
                        />
                    </div>
                </div>

                {/* Location Selection */}
                {plantingStage === "location" && (
                    <div className="space-y-6 animate-fade-in-up">
                        <Card className="bg-white backdrop-blur border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    Find a Planting Location
                                </CardTitle>
                                <CardDescription>Click the button below to find planting spots near you.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 mb-6 text-center bg-green-50 rounded-lg border border-green-200">
                                    <Button onClick={handleLocationRequest} variant="outline" className="mb-2">
                                        Use My Current Location
                                    </Button>
                                    {userLocation && (
                                        <p className="text-sm text-green-700 font-medium">
                                            ✅ Location captured! Check out the recommended spots below.
                                        </p>
                                    )}
                                    {locationError && (
                                        <p className="text-sm text-red-600 font-medium">
                                            ⚠️ {locationError}
                                        </p>
                                    )}
                                </div>

                                {/* --- UPDATED: Locations list is now conditional --- */}
                                {showLocations && (
                                    <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
                                        {locations.map((location) => (
                                            <div
                                                key={location.id}
                                                onClick={() => setSelectedLocation(location.id)}
                                                className={`cursor-pointer p-4 rounded-xl bg-green-50 border-2 transition-all duration-300 ${
                                                    selectedLocation === location.id
                                                        ? "border-green-500 shadow-[0_0_15px_4px_rgba(34,197,94,0.7)]"
                                                        : "border-transparent hover:border-green-500"
                                                } ${location.recommended ? "bg-primary/5" : ""}`}
                                            >
                                                <h3 className="font-semibold">{location.name}</h3>
                                                <p className="text-sm text-muted-foreground">{location.distance}</p>
                                                <p className="text-xs text-muted-foreground">Greenery: {location.greeneryLevel}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="mt-6 text-center">
                                    <Button
                                        variant="plant"
                                        size="lg"
                                        className="bg-green-500 text-white"
                                        disabled={!selectedLocation}
                                        onClick={() => setPlantingStage("plant-selection")}
                                    >
                                        Continue to Plant Selection
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Plant Selection */}
                {plantingStage === "plant-selection" && (
                    <div className="space-y-6 animate-fade-in-up">
                        <Card className="bg-white backdrop-blur border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TreePine className="w-5 h-5 text-primary" />
                                    Recommended Plants for Your Area
                                </CardTitle>
                                <CardDescription>
                                    Plants optimized for your local climate and soil conditions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {recommendedPlants.map((plant, index) => (
                                        <Card
                                            key={plant.id}
                                            className="border-border/50 hover:shadow-lg transition-smooth hover:scale-105 animate-fade-in-up"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-lg">{plant.name}</CardTitle>
                                                    <Badge className="bg-green-500" variant={plant.difficulty === "Easy" ? "default" : "secondary"}>
                                                        {plant.difficulty}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span>Survival: {plant.survivalRate}</span>
                                                    <span>Growth: {plant.growthTime}</span>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div>
                                                    <h4 className="font-medium mb-2">Growing Conditions</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Sun className="w-4 h-4 text-yellow-500" />
                                                            <span>{plant.conditions.sunlight}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Droplets className="w-4 h-4 text-blue-500" />
                                                            <span>{plant.conditions.water} Water</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Thermometer className="w-4 h-4 text-orange-500" />
                                                            <span>{plant.conditions.soil} Soil</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Environmental Benefits</h4>
                                                    <div className="space-y-1">
                                                        {plant.benefits.map((benefit, index) => (
                                                            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                                                <span>{benefit}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="plant "
                                                    className="w-full bg-green-500 text-white"
                                                    onClick={() => setPlantingStage("instructions")}
                                                >
                                                    Select This Plant
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Planting Instructions */}
                {plantingStage === "instructions" && (
                     <div className="space-y-6 animate-fade-in-up">
                        <Card className="bg-white backdrop-blur border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    Step-by-Step Planting Guide
                                </CardTitle>
                                <CardDescription>
                                    Follow these steps to ensure your plant has the best chance of thriving
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {plantingSteps.map((step, index) => (
                                        <div
                                            key={step.step}
                                            className="flex gap-4 animate-slide-in-right"
                                            style={{ animationDelay: `${index * 0.15}s` }}
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                                                    {step.step}
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                                                <p className="text-muted-foreground text-sm">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 p-4 bg-accent/20 rounded-lg border border-accent/30">
                                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Ready to Plant?
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        When you're at the location and ready to plant, click the button below to start location verification.
                                    </p>
                                    <Button className="bg-green-500 text-white" variant="plant" size="lg" onClick={() => setPlantingStage("verification")}>
                                        I'm Ready to Plant
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Verification & Tracking */}
                {plantingStage === "verification" && (
                    <div className="space-y-6 animate-fade-in-up">
                        <Card className="bg-white backdrop-blur border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    Location Verification
                                </CardTitle>
                                <CardDescription>We're verifying you're at the correct planting location</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-bounce-gentle">
                                        <MapPin className="w-8 h-8 text-primary animate-pulse" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Checking your location...</h3>
                                    <Progress value={75} className="w-full max-w-md mx-auto" />
                                    <p className="text-sm text-muted-foreground">
                                        Please ensure your GPS is enabled and you're at Central Park Area
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white backdrop-blur border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Leaf className="w-5 h-5 text-primary" />
                                    Plant Tracking Setup
                                </CardTitle>
                                <CardDescription>Set up monitoring for your newly planted tree</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                                        <h4 className="font-semibold mb-2">Growth Monitoring</h4>
                                        <p className="text-sm text-muted-foreground">
                                            We'll track your plant's growth through satellite imagery and periodic check-ins
                                        </p>
                                    </div>
                                    <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                                        <h4 className="font-semibold mb-2">Health Alerts</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Get notifications about watering needs, seasonal care, and potential issues
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center pt-4">
                                    <Button variant="plant" size="lg" className="w-full bg-green-600 text-white max-w-sm">
                                        Confirm Planting Complete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Planting;