
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

# Use relative imports if backend is a package
# import models, schemas, crud, auth, ml_model
# from .database import SessionLocal, engine  # no dot if in same folder
from backend import models, schemas, crud, auth, ml_model
from .database import SessionLocal, engine

# Initialize FastAPI app
app = FastAPI(title="Heart Risk App")

# Create database tables if they do not exist
models.Base.metadata.create_all(bind=engine)

# ------------------ CORS ------------------
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ DB Dependency ------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------ Routes ------------------

# Register
@app.post("/register", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    print("Received registration request:", user)
    
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    created_user = crud.create_user(db, user)  # create the user first
    #print("Created user:", created_user)
    
    return created_user


# Login (Token)
@app.post("/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # form_data.username contains the email in our frontend
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_medic": user.is_medic,
        "user_id": user.id,
        "name": user.name
    }

@app.post("/evaluate")
def evaluate(eval_in: schemas.EvalIn,
             current_user: models.User = Depends(auth.get_current_user),
             db: Session = Depends(get_db)):
    
    if current_user.is_medic:
        raise HTTPException(status_code=403, detail="Medics cannot submit evaluations")

    entry = crud.create_evaluation(db, current_user.id, eval_in)
    rec = "Low risk — maintain healthy lifestyle."
    if entry.risk > 0.7:
        rec = "High risk — consult a doctor immediately."
    elif entry.risk > 0.4:
        rec = "Moderate risk — increase exercise, monitor BP and cholesterol."

    return {"risk": entry.risk, "recommendation": rec, "id": entry.id}




# # Dashboard
# @app.get("/dashboard")
# def dashboard(
#     current_user: models.User = Depends(auth.get_current_user),
#     db: Session = Depends(get_db)
# ):
#     if current_user.is_medic:
#         return crud.get_all_users_with_evals(db)
#     else:
#         evals = crud.get_evaluations_for_user(db, current_user.id)
#         return [{"risk": e.risk, "created_at": e.created_at.isoformat()} for e in evals]
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from collections import Counter
from backend import ml_model

@app.get("/dashboard-analysis")
def dashboard_analysis():
    # Load dataset
    df = pd.read_csv("backend/cardio_train.csv")

    # Drop 'id' if present
    if 'id' in df.columns:
        df = df.drop(columns=['id'])

    # Preprocess dataset
    df['age'] = (df['age'] / 365).round(1)  # age in years
    df['gender_label'] = df['gender'].map({1: "Female", 2: "Male"})

    # Calculate risk if not already present
    if 'cardio' in df.columns:
        df['risk'] = df['cardio']
    else:
        df['risk'] = df.apply(lambda row: ml_model.predict_risk(row.to_dict()), axis=1)

    # Categorize risk
    def categorize(r):
        if r > 0.7: return "High"
        elif r > 0.4: return "Moderate"
        else: return "Low"
    df['risk_category'] = df['risk'].apply(categorize)

    # --- Line chart: Risk by Age (all ages in dataset) ---
    age_range = np.arange(df['age'].min(), df['age'].max() + 1)
    line_data = []
    for age in age_range:
        subset = df[df['age'] == age]
        avg_risk = subset['risk'].mean() if not subset.empty else 0
        line_data.append({"age": age, "risk": float(avg_risk)})

    # --- Pie chart: Average Risk by Gender ---
    gender_risk = []
    for gender in ['Female', 'Male']:
        subset = df[df['gender_label'] == gender]
        avg_risk = subset['risk'].mean() if not subset.empty else 0
        gender_risk.append({"gender_label": gender, "risk": float(avg_risk)})

    # --- Bar charts: Feature influence per gender using correlation ---
    exclude_cols = ['age', 'gender', 'gender_label', 'risk', 'risk_category', 'cardio', 'target']
    all_features = [col for col in df.columns if col not in exclude_cols]
    bar_data = {}
    for gender in ['Female', 'Male']:
        subset = df[df['gender_label'] == gender]
        if not subset.empty:
            corr = subset[all_features + ['risk']].corr()['risk'].drop('risk').to_dict()
            bar_data[gender] = [{"feature": f, "value": abs(v)} for f, v in corr.items()]
            # Sort descending so most influential features appear first
            bar_data[gender] = sorted(bar_data[gender], key=lambda x: x['value'], reverse=True)
        else:
            bar_data[gender] = []

    # --- Pie chart: Dataset distribution by risk category ---
    risk_summary = dict(Counter(df['risk_category']))

    return JSONResponse({
        "line_data": line_data,
        "gender_risk": gender_risk,
        "bar_data": bar_data,
        "risk_summary": risk_summary
    })

# Chatbot
@app.post("/chat")
def chat(query: dict, current_user: models.User = Depends(auth.get_current_user)):
    q = query.get("message", "")
    if "exercise" in q.lower():
        return {"answer": "Regular moderate exercise (30 min/day) reduces heart risk."}
    if "cholesterol" in q.lower():
        return {"answer": "Maintain low saturated fats and consult with your medic."}
    return {"answer": "I'm a simple helper - consult a medic for personalized advice."}

# Train model
@app.post("/train")
def train_model():
    ml_model.train_model_from_csv("backend/cardio_train.csv")
    return {"status": "trained"}
