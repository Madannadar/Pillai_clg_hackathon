import { useState } from "react";
import axios from "axios";
import { Button } from "../components/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import { Progress } from "../components/progress";
import { MapPin, TreePine, CheckCircle, Clock, Droplets, Sun, Thermometer, LoaderCircle } from "lucide-react";
import PlantyMascot from "../components/PlantyMascot";

const Planting = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [plantingStage, setPlantingStage] = useState("location");
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [showLocations, setShowLocations] = useState(false);

  // API states
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const locations = [
    { id: "1", name: "Central Park Area, Mumbai", lat: 19.078, lng: 72.88, distance: "0.5 km", greeneryLevel: "Low" },
    { id: "2", name: "Riverside Gardens, Mumbai", lat: 19.085, lng: 72.87, distance: "1.2 km", greeneryLevel: "Medium" },
    { id: "3", name: "Community Center, Mumbai", lat: 19.070, lng: 72.875, distance: "0.8 km", greeneryLevel: "Very Low" },
  ];

  const recommendedPlants = [
    { id: "1", name: "Oak Tree", difficulty: "Easy", survivalRate: "95%", growthTime: "2-3 years", conditions: { sunlight: "Full Sun", water: "Medium", soil: "Well-drained" } },
    { id: "2", name: "Maple Tree", difficulty: "Medium", survivalRate: "88%", growthTime: "3-4 years", conditions: { sunlight: "Partial Sun", water: "High", soil: "Moist" } },
    { id: "3", name: "Pine Tree", difficulty: "Easy", survivalRate: "92%", growthTime: "1-2 years", conditions: { sunlight: "Full Sun", water: "Low", soil: "Sandy" } },
  ];

  const plantingSteps = [
    { step: 1, title: "Prepare the Site", description: "Clear the area and dig a hole twice the width of the root ball" },
    { step: 2, title: "Place the Plant", description: "Gently remove from container and place in hole" },
    { step: 3, title: "Backfill & Water", description: "Fill with soil and water thoroughly" },
    { step: 4, title: "Final Setup", description: "Add mulch and stake if necessary" },
  ];

  const handleLocationRequest = () => {
    setLocationError("");
    setUserLocation(null);
    setShowLocations(false);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        setShowLocations(true);
      },
      (error) => {
        let message = "An unknown error occurred.";
        if (error.code === error.PERMISSION_DENIED) message = "You denied the request for Geolocation.";
        if (error.code === error.POSITION_UNAVAILABLE) message = "Location information is unavailable.";
        if (error.code === error.TIMEOUT) message = "The request to get user location timed out.";
        setLocationError(message);
      }
    );
  };

  const handleSelectPlant = async (plant) => {
    if (!selectedLocation) return;

    setIsLoading(true);
    setApiError("");

    const locationData = locations.find(loc => loc.id === selectedLocation);
    if (!locationData) {
      setApiError("Selected location not found. Please go back and select a location.");
      setIsLoading(false);
      return;
    }

    // ✅ get userId + token from localStorage
    const token = localStorage.getItem("token");
    var user = JSON.parse(localStorage.getItem("user"));
    
    
    

    if (!user) {
      setApiError("⚠️ Please login again. Missing authentication.");
      setIsLoading(false);
      return;
    }

    const payload = {
      userId:user.id, // ✅ now included
      plantName: plant.name,
      location: {
        latitude: locationData.lat,
        longitude: locationData.lng,
      }
    };

    try {
      const response = await axios.post("http://localhost:5000/api/plant/createplant", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setPlantingStage("instructions");
      } else {
        setApiError(response.data.error || "Failed to create planting request.");
      }

    } catch (err) {
      setApiError(err.response?.data?.error || err.message || "API Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-500 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-white mb-4">Plant Your Impact</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
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

        {/* LOCATION SELECTION */}
        {plantingStage === "location" && (
          <Card className="bg-white/90 backdrop-blur-sm border-none shadow-xl space-y-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />Find a Planting Location
              </CardTitle>
              <CardDescription>Use your current location to find recommended planting spots near you.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 mb-6 text-center bg-green-50 rounded-lg border border-green-200">
                <Button onClick={handleLocationRequest} variant="outline" className="mb-2">
                  Use My Current Location
                </Button>
                {userLocation && <p className="text-sm text-green-700 font-medium">✅ Location captured!</p>}
                {locationError && <p className="text-sm text-red-600 font-medium">⚠️ {locationError}</p>}
              </div>

              {showLocations && (
                <div className="grid md:grid-cols-3 gap-6">
                  {locations.map(loc => (
                    <div
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc.id)}
                      className={`cursor-pointer p-4 rounded-xl bg-green-50 border-2 transition-all duration-300 ${
                        selectedLocation === loc.id
                          ? "border-green-500 shadow-[0_0_15px_4px_rgba(34,197,94,0.7)]"
                          : "border-transparent hover:border-green-500"
                      }`}
                    >
                      <h3 className="font-semibold">{loc.name}</h3>
                      <p className="text-sm text-muted-foreground">{loc.distance}</p>
                      <p className="text-xs text-muted-foreground">Greenery: {loc.greeneryLevel}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 text-center">
                <Button
                  size="lg"
                  className="bg-green-600 text-white"
                  disabled={!selectedLocation}
                  onClick={() => setPlantingStage("plant-selection")}
                >
                  Continue to Plant Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PLANT SELECTION */}
        {plantingStage === "plant-selection" && (
          <Card className="bg-white/90 backdrop-blur-sm border-none shadow-xl space-y-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="w-5 h-5 text-green-600" />Recommended Plants
              </CardTitle>
              <CardDescription>Plants optimized for your local climate and soil conditions</CardDescription>
            </CardHeader>
            <CardContent>
              {apiError && <p className="text-center text-red-600 font-medium mb-4">{apiError}</p>}
              <div className="grid md:grid-cols-3 gap-6">
                {recommendedPlants.map(plant => (
                  <Card key={plant.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{plant.name}</CardTitle>
                        <Badge className="bg-green-500 text-white">{plant.difficulty}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Survival: {plant.survivalRate}</span>
                        <span>Growth: {plant.growthTime}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Growing Conditions</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4 text-yellow-500" />
                            {plant.conditions.sunlight}
                          </div>
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            {plant.conditions.water} Water
                          </div>
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            {plant.conditions.soil} Soil
                          </div>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-green-600 text-white"
                        onClick={() => handleSelectPlant(plant)}
                        disabled={isLoading}
                      >
                        {isLoading ? <LoaderCircle className="animate-spin" /> : "Select This Plant"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* INSTRUCTIONS */}
        {plantingStage === "instructions" && (
          <Card className="bg-white/90 backdrop-blur-sm border-none shadow-xl space-y-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />Step-by-Step Planting Guide
              </CardTitle>
              <CardDescription>Follow these steps to ensure your plant thrives</CardDescription>
            </CardHeader>
            <CardContent>
              {plantingSteps.map(step => (
                <div key={step.step} className="flex gap-4 items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
              <div className="mt-8 p-4 bg-green-50 rounded-lg text-center">
                <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />Ready to Plant?
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  When you're at the location, click below to start verification.
                </p>
                <Button
                  size="lg"
                  className="bg-green-600 text-white"
                  onClick={() => setPlantingStage("verification")}
                >
                  I'm Ready to Plant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Planting;
