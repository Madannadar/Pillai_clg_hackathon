# main.py
from fastapi import FastAPI, HTTPException
from models import PlantHealthFeatures, PredictionResponse
from predictor import predictor # Import the predictor instance

# Initialize the FastAPI application
app = FastAPI(
    title="Plant Health Prediction API",
    description="An API to predict regional plant health (Average NDVI) based on monthly weather data.",
    version="1.0.0"
)

@app.get("/", summary="Root Endpoint", tags=["General"])
def read_root():
    """A simple hello world endpoint to check if the API is running."""
    return {"message": "Welcome to the Plant Health Prediction API. Use the /predict endpoint to make a prediction."}


@app.post("/predict",
          response_model=PredictionResponse,
          summary="Predict Plant Health",
          tags=["Prediction"])
def predict_ndvi(features: PlantHealthFeatures):
    """
    Takes a JSON object with weather and location data and returns the predicted
    average NDVI for that month.
    """
    try:
        # The complex logic is now handled by the predictor object
        predicted_value = predictor.predict(features)
        return {"predicted_avg_ndvi": predicted_value}
    except HTTPException as e:
        # Re-raise HTTP exceptions from the predictor
        raise e
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected server error occurred: {e}")