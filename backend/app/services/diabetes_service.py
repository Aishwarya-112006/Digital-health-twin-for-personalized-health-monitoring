import json
from pathlib import Path

import joblib
import pandas as pd


# Find the project root directory.
PROJECT_ROOT = Path(__file__).resolve().parents[3]

# Paths to the trained model and its configuration.
MODEL_PATH = PROJECT_ROOT / "ml" / "diabetes" / "diabetes_model.pkl"
CONFIG_PATH = PROJECT_ROOT / "ml" / "diabetes" / "model_config.json"


# Load the trained model.
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

model = joblib.load(MODEL_PATH)


# Load the decision threshold.
with open(CONFIG_PATH, "r", encoding="utf-8") as file:
    config = json.load(file)

THRESHOLD = float(config["threshold"])


# Features must follow the same order and names used during training.
FEATURES = [
    "RIDAGEYR",
    "RIAGENDR",
    "BMXBMI",
    "BPXOSY1",
    "BPXODI1",
    "LBXTC",
]


def generate_health_insights(health_data: dict):
    """
    Generate simple explanations of submitted health measurements.
    These are educational observations, not medical diagnoses.
    """

    insights = []

    # 1. BMI insight
    bmi = health_data["BMXBMI"]

    if bmi < 18.5:
        insights.append({
            "parameter": "BMI",
            "value": bmi,
            "status": "Below the usual range",
            "explanation": (
                "Your BMI is below the commonly used healthy adult "
                "range. Consider discussing your weight and nutritional "
                "needs with a healthcare professional."
            ),
            "attention": "moderate"
        })

    elif bmi < 25:
        insights.append({
            "parameter": "BMI",
            "value": bmi,
            "status": "Within the usual range",
            "explanation": (
                "Your BMI falls within the commonly used healthy adult "
                "range. Maintaining balanced nutrition and regular "
                "activity can support your health."
            ),
            "attention": "low"
        })

    elif bmi < 30:
        insights.append({
            "parameter": "BMI",
            "value": bmi,
            "status": "Above the usual range",
            "explanation": (
                "Your BMI falls in the overweight category. BMI is "
                "only a screening measure and does not directly measure "
                "body fat or overall health."
            ),
            "attention": "moderate"
        })

    else:
        insights.append({
            "parameter": "BMI",
            "value": bmi,
            "status": "In the obesity range",
            "explanation": (
                "Your BMI falls in the obesity category. This can be "
                "associated with metabolic health risks, but BMI alone "
                "cannot determine your health."
            ),
            "attention": "high"
        })

    # 2. Blood pressure insight
    systolic = health_data["BPXOSY1"]
    diastolic = health_data["BPXODI1"]

    if systolic >= 130 or diastolic >= 80:
        insights.append({
            "parameter": "Blood Pressure",
            "value": f"{systolic}/{diastolic} mmHg",
            "status": "Above the ideal range",
            "explanation": (
                "Your submitted blood pressure reading is above the "
                "usual ideal range. One reading cannot confirm high "
                "blood pressure. Repeated measurements and professional "
                "guidance are important."
            ),
            "attention": "moderate"
        })

    else:
        insights.append({
            "parameter": "Blood Pressure",
            "value": f"{systolic}/{diastolic} mmHg",
            "status": "Within the usual range",
            "explanation": (
                "Your submitted reading is below the commonly used "
                "threshold for high blood pressure. Continue monitoring "
                "it periodically."
            ),
            "attention": "low"
        })

    # 3. Total cholesterol insight
    cholesterol = health_data["LBXTC"]

    if cholesterol < 200:
        insights.append({
            "parameter": "Total Cholesterol",
            "value": f"{cholesterol} mg/dL",
            "status": "Desirable range",
            "explanation": (
                "Your total cholesterol is below 200 mg/dL, which is "
                "generally considered desirable for adults. A complete "
                "lipid profile provides more information."
            ),
            "attention": "low"
        })

    elif cholesterol < 240:
        insights.append({
            "parameter": "Total Cholesterol",
            "value": f"{cholesterol} mg/dL",
            "status": "Borderline high",
            "explanation": (
                "Your total cholesterol is in the borderline-high "
                "range. A complete lipid profile can help explain "
                "your cholesterol levels more accurately."
            ),
            "attention": "moderate"
        })

    else:
        insights.append({
            "parameter": "Total Cholesterol",
            "value": f"{cholesterol} mg/dL",
            "status": "High range",
            "explanation": (
                "Your total cholesterol is in the high range. Consider "
                "discussing a complete lipid profile and appropriate "
                "next steps with a healthcare professional."
            ),
            "attention": "high"
        })

    return insights


def predict_diabetes(health_data: dict):
    """
    Predict whether the submitted health profile resembles
    the self-reported diabetes patterns learned from NHANES.
    """

    input_data = pd.DataFrame(
        [[health_data[feature] for feature in FEATURES]],
        columns=FEATURES,
    )

    # Get the model's estimated probability for the positive class.
    probability = float(model.predict_proba(input_data)[0][1])

    # Apply the threshold selected during validation.
    prediction = int(probability >= THRESHOLD)

    # Generate plain-language health insights.
    health_insights = generate_health_insights(health_data)

    return {
        "prediction": prediction,
        "model_score": round(probability, 4),
        "threshold": THRESHOLD,
        "message": (
            "The model identified a positive pattern."
            if prediction == 1
            else "The model did not identify a positive pattern."
        ),
        "health_insights": health_insights,
        "disclaimer": (
            "Experimental model output based on NHANES data. "
            "Health insights are general educational observations, "
            "not medical advice or a diagnosis. "
            "The model does not predict future diabetes."
        ),
    }
