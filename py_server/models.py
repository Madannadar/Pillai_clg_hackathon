# models.py
from pydantic import BaseModel, Field
from enum import Enum

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