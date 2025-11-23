

from ml_model import train_model_from_csv

if __name__ == "__main__":
    # Path to your CSV file
    csv_path = "backend/cardio_train.csv"
    
    print("Training model from CSV...")
    model = train_model_from_csv(csv_path)
    print("Model trained and saved successfully at 'backend/model.joblib'")
