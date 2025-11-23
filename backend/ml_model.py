import joblib
import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# Make sure model is saved inside backend folder
MODEL_PATH = "backend/model.joblib"

# Order of features expected by the ML model
FEATURE_ORDER = ['age', 'gender', 'weight', 'cholesterol', 'ap_hi', 'ap_lo', 'smoke', 'active']

def train_model_from_csv(csv_path="backend/cardio_train.csv"):
    """
    Train the RandomForestClassifier from a CSV dataset and save the model.
    """
    df = pd.read_csv(csv_path)
    
    # Ensure target column exists
    target_col = "cardio" if "cardio" in df.columns else ("target" if "target" in df.columns else None)
    if target_col is None:
        raise ValueError("Cannot find a target column named 'cardio' or 'target' in CSV")
    
    X = df[FEATURE_ORDER]
    y = df[target_col]
    
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X, y)
    
    joblib.dump(model, MODEL_PATH)
    return model

def predict_risk(features: dict):
    """
    Predict cardiovascular risk using the trained model.
    Ensures all features are numeric floats to avoid NaN.
    """
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("Model not found. Run train_model_from_csv first.")

    model = joblib.load(MODEL_PATH)

    # Ensure all features are numeric
    arr = np.array([[float(features[k]) for k in FEATURE_ORDER]])

    # Use predict_proba if available
    if hasattr(model, "predict_proba"):
        prob = model.predict_proba(arr)[0][1]
        if np.isnan(prob):
            print("Warning: predicted probability is NaN")
            prob = 0.0
        return float(prob)

    # fallback to predict
    pred = model.predict(arr)[0]
    return float(pred)

