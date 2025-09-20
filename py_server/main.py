# main.py
# from fastapi import FastAPI, HTTPException
from models import PlantHealthFeatures, PredictionResponse
from predictor import predictor # Import the predictor instance
import rasterio
import numpy as np
import tempfile
import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, Field
from enum import Enum
from io import BytesIO
import matplotlib.pyplot as plt
import matplotlib.colors as colors
from matplotlib.colors import ListedColormap


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
    


@app.post("/reclassify", tags=["Raster Processing"])
async def reclassify_ndvi(file: UploadFile = File(...)):
    """
    Reclassifies a single NDVI raster file into three categories and returns a PNG image:
    1. Non-vegetated (< 0.2)
    2. Sparse vegetation (0.2 - 0.4)
    3. Dense vegetation (> 0.4)
    """
    if not file.filename.endswith('.tif'):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a .tif file.")

    file_content = await file.read()
    
    try:
        with rasterio.open(BytesIO(file_content)) as src:
            ndvi = src.read(1)
            
            reclassified = np.zeros(ndvi.shape, dtype=np.int16)
            reclassified[ndvi < 0.2] = 1
            reclassified[(ndvi >= 0.2) & (ndvi <= 0.4)] = 2
            reclassified[ndvi > 0.4] = 3
            
            output_buffer = BytesIO()
            cmap = ListedColormap(['brown', 'yellow', 'green'])
            fig, ax = plt.subplots(1, 1, figsize=(10, 10))
            im = ax.imshow(reclassified, cmap=cmap, vmin=1, vmax=3)
            ax.set_title(f'Reclassified NDVI - {file.filename}', fontsize=16)
            ax.set_axis_off()
            cbar = fig.colorbar(im, ax=ax, ticks=[1, 2, 3], shrink=0.6)
            cbar.ax.set_yticklabels(['Non-vegetated (<0.2)', 'Sparse Veg (0.2-0.4)', 'Dense Veg (>0.4)'])
            plt.savefig(output_buffer, format='png', bbox_inches='tight')
            plt.close(fig)
            output_buffer.seek(0)
            return StreamingResponse(output_buffer, media_type="image/png", headers={"Content-Disposition": f"inline; filename=reclassified_{file.filename.replace('.tif', '.png')}"})

    except rasterio.RasterioIOError:
        raise HTTPException(status_code=422, detail="Could not read the raster file. Please ensure it is a valid GeoTIFF.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during processing: {str(e)}")

@app.post("/calculate_change", tags=["Raster Processing"])
async def calculate_ndvi_change(
    file_2018: UploadFile = File(..., description="NDVI raster from the earlier year"),
    file_2024: UploadFile = File(..., description="NDVI raster from the later year")
):
    """
    Calculates the change in NDVI between two raster files and returns a PNG image of the change map.
    """
    if not (file_2018.filename.endswith('.tif') and file_2024.filename.endswith('.tif')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload two .tif files.")

    file_2018_content = await file_2018.read()
    file_2024_content = await file_2024.read()

    try:
        with rasterio.open(BytesIO(file_2018_content)) as src_2018:
            ndvi_2018 = src_2018.read(1)

        with rasterio.open(BytesIO(file_2024_content)) as src_2024:
            ndvi_2024 = src_2024.read(1)

        if ndvi_2018.shape != ndvi_2024.shape:
            raise HTTPException(status_code=400, detail="The input rasters do not have the same dimensions.")

        ndvi_change = ndvi_2024 - ndvi_2018
        
        output_buffer = BytesIO()
        cmap = plt.get_cmap('RdYlGn')
        fig, ax = plt.subplots(1, 1, figsize=(12, 12))
        div_norm = colors.TwoSlopeNorm(vmin=-0.5, vcenter=0, vmax=0.5)
        im = ax.imshow(ndvi_change, cmap=cmap, norm=div_norm)
        ax.set_title(f"Vegetation Change ({file_2018.filename.split('.')[0]} vs {file_2024.filename.split('.')[0]})", fontsize=16)
        ax.set_axis_off()
        cbar = fig.colorbar(im, ax=ax, shrink=0.7)
        cbar.set_label('NDVI Change (Green = Gain, Red = Loss)')
        plt.savefig(output_buffer, format='png', bbox_inches='tight')
        plt.close(fig)
        output_buffer.seek(0)
        return StreamingResponse(output_buffer, media_type="image/png", headers={"Content-Disposition": f"inline; filename=change_map.png"})

    except rasterio.RasterioIOError:
        raise HTTPException(status_code=422, detail="Could not read one or more raster files. Please ensure they are valid GeoTIFFs.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during processing: {str(e)}")
