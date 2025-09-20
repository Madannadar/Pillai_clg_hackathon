import pickle
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from enum import Enum

# --- 1. Define Application and Load Model ---

# Initialize the FastAPI application
app = FastAPI(
    title="Plant Health Prediction API",
    description="An API to predict regional plant health (Average NDVI) based on monthly weather data.",
    version="1.0.0"
)

# Load the trained model and the feature columns list
MODEL_FILENAME = 'plant_health_monthly_model-1000.pkl'
try:
    with open(MODEL_FILENAME, 'rb') as file:
        model, model_features = pickle.load(file)
    print("✅ Model and feature list loaded successfully.")
except FileNotFoundError:
    print(f"❌ CRITICAL ERROR: Model file '{MODEL_FILENAME}' not found. The API cannot start.")
    model = None # Set model to None to indicate it failed to load

# --- 2. Define Data Structures for Input Validation ---

# Create an Enum for valid locations to ensure only trained locations can be used
class Location(str, Enum):
    panvel = "Panvel"
    kalyan = "Kalyan"
    thane = "Thane"
    tirunveli = "Tirunveli"
    vilupuram = "Vilupuram"
    thiruvannamalai = "Thiruvannamalai"
    mandangad = "Mandangad"

# Define the input data model using Pydantic for automatic validation
class PlantHealthFeatures(BaseModel):
    year: int = Field(..., example=2025, description="The year of the prediction.")
    month: int = Field(..., ge=1, le=12, example=7, description="The month of the prediction (1-12).")
    min_temp_c: float = Field(..., example=22.5, description="Minimum temperature of the month in Celsius.")
    max_temp_c: float = Field(..., example=35.0, description="Maximum temperature of the month in Celsius.")
    mean_temp_c: float = Field(..., example=28.2, description="Average temperature of the month in Celsius.")
    total_precip_mm: float = Field(..., example=150.0, description="Total precipitation for the month in millimeters.")
    total_solar_rad_j_m2: float = Field(..., example=1.5e9, description="Total solar radiation for the month in Joules/m^2.")
    rainy_days: int = Field(..., example=15, description="The number of days with rain in the month.")
    location: Location = Field(..., example="Thane", description="The geographical location for the prediction.")


# --- 3. Define the Prediction Endpoint ---

@app.on_event("startup")
async def startup_event():
    if model is None:
        raise RuntimeError(f"Could not load the model from {MODEL_FILENAME}. API cannot function.")

@app.get("/", summary="Root Endpoint", description="A simple hello world endpoint to check if the API is running.")
def read_root():
    return {"message": "Welcome to the Plant Health Prediction API. Use the /predict endpoint to make a prediction."}


@app.post("/predict", summary="Predict Plant Health", description="Predicts the average NDVI based on input weather features.")
def predict_ndvi(features: PlantHealthFeatures):
    """
    Takes a JSON object with weather and location data, and returns the predicted
    average NDVI for that month.
    """
    # 1. Convert the input Pydantic model into a dictionary
    input_data = features.dict()

    # 2. Create a pandas DataFrame from the dictionary, formatted like the training data
    prediction_df = pd.DataFrame(columns=model_features)
    prediction_df.loc[0] = 0
    
    # 3. Populate the DataFrame with the input data
    for key, value in input_data.items():
        if key != 'location':
            prediction_df[key] = value

    # 4. Handle the one-hot encoded 'location' feature (THE FIX IS HERE)
    # Explicitly get the string value from the Enum before creating the column name
    location_name = features.location.value
    location_column = f"loc_{location_name}"
    
    if location_column in prediction_df.columns:
        prediction_df[location_column] = True
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Location '{location_name}' is invalid or was not included in the model training."
        )

    # 5. Ensure the column order is exactly the same as during training
    prediction_df = prediction_df[model_features]

    # 6. Make the prediction
    try:
        prediction = model.predict(prediction_df)
        predicted_ndvi = prediction[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {e}")

    return {"predicted_avg_ndvi": float(predicted_ndvi)}

