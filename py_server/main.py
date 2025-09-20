import pandas as pd
import json
import rasterio
import numpy as np
from io import BytesIO
import matplotlib.pyplot as plt
import matplotlib.colors as colors
from matplotlib.colors import ListedColormap
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from enum import Enum
import joblib
import os

# --- Pydantic Models ---
class Location(str, Enum):
    """An enumeration for valid geographical locations."""
    panvel = "Panvel"
    kalyan = "Kalyan"
    thane = "Thane"
    tirunveli = "Tirunveli"
    vilupuram = "Vilupuram"
    thiruvannamalai = "Thiruvannamalai"
    mandangad = "Mandangad"

class PlantHealthFeatures(BaseModel):
    """Defines the input features for a prediction request."""
    year: int = Field(..., example=2025, description="The year of the prediction.")
    month: int = Field(..., ge=1, le=12, example=7, description="The month of the prediction (1-12).")
    min_temp_c: float = Field(..., example=22.5, description="Minimum temperature of the month in Celsius.")
    max_temp_c: float = Field(..., example=35.0, description="Maximum temperature of the month in Celsius.")
    mean_temp_c: float = Field(..., example=28.2, description="Average temperature of the month in Celsius.")
    total_precip_mm: float = Field(..., example=150.0, description="Total precipitation for the month in millimeters.")
    total_solar_rad_j_m2: float = Field(..., example=1.5e9, description="Total solar radiation for the month in Joules/m^2.")
    rainy_days: int = Field(..., example=15, description="The number of days with rain in the month.")
    location: Location = Field(..., example="Thane", description="The geographical location for the prediction.")

class PredictionResponse(BaseModel):
    """Defines the structure of the prediction response."""
    predicted_avg_ndvi: float

class LocationYearRequest(BaseModel):
    """Defines the input features for raster processing endpoints."""
    location: str = Field(..., example="Kalyan", description="The name of the location.")
    year: int = Field(..., example=2018, description="The year of the satellite imagery.")

# --- Prediction Logic ---
class Predictor:
    def __init__(self, model_path: str = 'plant_health_monthly_model-1000.pkl'):
        self.model_path = model_path
        self.model = None
        self.feature_list = None
        self._load_model()

    def _load_model(self):
        try:
            with open(self.model_path, 'rb') as file:
                self.model, self.feature_list = joblib.load(file)
            print("✅ Model and feature list loaded successfully.")
        except FileNotFoundError:
            raise FileNotFoundError(f"Model file not found at: {self.model_path}")
        except Exception as e:
            raise Exception(f"Failed to load model: {e}")

    def predict(self, features: PlantHealthFeatures):
        if not self.model or not self.feature_list:
            raise HTTPException(status_code=500, detail="Model not loaded. Please contact the administrator.")
        
        input_data = features.model_dump()
        input_df = pd.DataFrame([input_data])
        
        # One-hot encode the location
        for loc in self.feature_list:
            if loc.startswith('location_'):
                input_df[loc] = 0
        
        loc_col_name = f"location_{input_data['location']}"
        if loc_col_name in input_df.columns:
            input_df[loc_col_name] = 1
        
        # Ensure the order of columns matches the training data
        input_df = input_df[self.feature_list]
        
        prediction = self.model.predict(input_df)[0]
        
        return float(prediction)

predictor = Predictor()

# --- Utility Functions ---
def find_raster_file(location, year, metadata_file='metadata.csv'):
    """Finds the raster file path for a given location and year."""
    try:
        df = pd.read_csv(metadata_file)
        result = df[(df['location'] == location) & (df['year'] == year)]
        if not result.empty:
            # Assuming 'ndvi_file_name' is the column with file names
            return f"NDVI/{result['ndvi_file_name'].iloc[0]}"
        return None
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Metadata file not found on the server.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while searching for file: {e}")

# --- FastAPI Application ---
app = FastAPI(
    title="Plant Health and Raster Analysis API",
    description="An API to predict plant health and perform raster analysis.",
    version="1.0.0"
)

# --- Endpoints ---
@app.get("/", summary="Root Endpoint", tags=["General"])
def read_root():
    """A simple hello world endpoint."""
    return {"message": "Welcome to the API. Use the /docs endpoint to see available operations."}

@app.post("/predict", response_model=PredictionResponse, summary="Predict Plant Health", tags=["Prediction"])
def predict_ndvi(features: PlantHealthFeatures):
    """Predicts average NDVI based on weather and location data."""
    try:
        predicted_value = predictor.predict(features)
        return {"predicted_avg_ndvi": predicted_value}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected server error occurred: {str(e)}")

@app.post("/reclassify", tags=["Raster Processing"])
async def reclassify_ndvi(request: LocationYearRequest):
    """Reclassifies a single NDVI raster file and returns a PNG image."""
    file_path = find_raster_file(request.location, request.year)
    if not file_path:
        raise HTTPException(status_code=404, detail=f"No raster found for location '{request.location}' in year {request.year}.")

    try:
        with rasterio.open(file_path) as src:
            ndvi = src.read(1)
            reclassified = np.zeros(ndvi.shape, dtype=np.int16)
            reclassified[ndvi < 0.2] = 1
            reclassified[(ndvi >= 0.2) & (ndvi <= 0.4)] = 2
            reclassified[ndvi > 0.4] = 3

            output_buffer = BytesIO()
            cmap = ListedColormap(['brown', 'yellow', 'green'])
            fig, ax = plt.subplots(1, 1, figsize=(10, 10))
            im = ax.imshow(reclassified, cmap=cmap, vmin=1, vmax=3)
            ax.set_title(f'Reclassified NDVI - {request.location} {request.year}', fontsize=16)
            ax.set_axis_off()
            cbar = fig.colorbar(im, ax=ax, ticks=[1, 2, 3], shrink=0.6)
            cbar.ax.set_yticklabels(['Non-vegetated (<0.2)', 'Sparse Veg (0.2-0.4)', 'Dense Veg (>0.4)'])
            plt.savefig(output_buffer, format='png', bbox_inches='tight')
            plt.close(fig)
            output_buffer.seek(0)
            return StreamingResponse(output_buffer, media_type="image/png", headers={"Content-Disposition": f"attachment; filename=reclassified_{request.location}_{request.year}.png"})
    
    except rasterio.RasterioIOError:
        raise HTTPException(status_code=422, detail="Could not read the raster file. Please ensure it is a valid GeoTIFF.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during processing: {str(e)}")

@app.post("/calculate_change", tags=["Raster Processing"])
async def calculate_ndvi_change(request_2018: LocationYearRequest, request_2024: LocationYearRequest):
    """Calculates the change in NDVI between two years and returns a PNG image."""
    if request_2018.year == request_2024.year:
        raise HTTPException(status_code=400, detail="The input years must be different to calculate a change map.")
    
    file_path_2018 = find_raster_file(request_2018.location, request_2018.year)
    file_path_2024 = find_raster_file(request_2024.location, request_2024.year)

    if not file_path_2018 or not file_path_2024:
        raise HTTPException(status_code=404, detail="One or both raster files not found.")

    try:
        with rasterio.open(file_path_2018) as src_2018, rasterio.open(file_path_2024) as src_2024:
            ndvi_2018 = src_2018.read(1)
            ndvi_2024 = src_2024.read(1)

            if ndvi_2018.shape != ndvi_2024.shape:
                raise HTTPException(status_code=400, detail="The input rasters do not have the same dimensions.")

            ndvi_change = ndvi_2024 - ndvi_2018
            
            output_buffer = BytesIO()
            cmap = plt.get_cmap('RdYlGn')
            fig, ax = plt.subplots(1, 1, figsize=(12, 12))
            div_norm = colors.TwoSlopeNorm(vmin=-0.5, vcenter=0, vmax=0.5)
            im = ax.imshow(ndvi_change, cmap=cmap, norm=div_norm)
            ax.set_title(f"Vegetation Change ({request_2018.location}, {request_2018.year} vs {request_2024.year})", fontsize=16)
            ax.set_axis_off()
            cbar = fig.colorbar(im, ax=ax, shrink=0.7)
            cbar.set_label('NDVI Change (Green = Gain, Red = Loss)')
            plt.savefig(output_buffer, format='png', bbox_inches='tight')
            plt.close(fig)
            output_buffer.seek(0)
            return StreamingResponse(output_buffer, media_type="image/png", headers={"Content-Disposition": f"attachment; filename=change_map_{request_2018.location}_{request_2018.year}-{request_2024.year}.png"})

    except rasterio.RasterioIOError:
        raise HTTPException(status_code=422, detail="Could not read one or more raster files. Please ensure they are valid GeoTIFFs.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during processing: {str(e)}")
