# predictor.py
import pickle
import pandas as pd
from fastapi import HTTPException
from models import PlantHealthFeatures

MODEL_FILENAME = 'plant_health_monthly_model-1000.pkl'

class ModelPredictor:
    """A class to handle model loading and prediction."""
    def __init__(self, model_path: str):
        try:
            with open(model_path, 'rb') as file:
                self.model, self.model_features = pickle.load(file)
            print("✅ Model and feature list loaded successfully.")
        except FileNotFoundError:
            print(f"❌ CRITICAL ERROR: Model file '{model_path}' not found.")
            raise RuntimeError(f"Could not load the model from {model_path}")

    def predict(self, features: PlantHealthFeatures) -> float:
        """
        Generates a prediction from the input features.
        """
        # 1. Convert the input data into a dictionary
        input_data = features.dict()

        # 2. Create a DataFrame with the correct columns and order
        prediction_df = pd.DataFrame(columns=self.model_features)
        prediction_df.loc[0] = 0 # Initialize a row with zeros

        # 3. Populate the DataFrame with the input data
        for key, value in input_data.items():
            if key != 'location':
                prediction_df[key] = value

        # 4. Handle the one-hot encoded 'location' feature
        location_name = features.location.value
        location_column = f"loc_{location_name}"

        if location_column in prediction_df.columns:
            prediction_df[location_column] = True
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Location '{location_name}' is invalid or was not part of the model training."
            )

        # 5. Ensure column order matches the training order
        prediction_df = prediction_df[self.model_features]

        # 6. Make the prediction
        try:
            prediction = self.model.predict(prediction_df)
            return float(prediction[0])
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {e}")

# Create a single instance of the predictor to be used by the API
# This ensures the model is loaded only once when the application starts
predictor = ModelPredictor(MODEL_FILENAME)