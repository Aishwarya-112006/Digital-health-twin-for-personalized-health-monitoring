from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.app.services.diabetes_service import predict_diabetes

router = APIRouter()


class DiabetesInput(BaseModel):
    age: int = Field(..., ge=18, le=120)
    gender: int = Field(..., ge=1, le=2)
    bmi: float = Field(..., ge=10, le=80)
    systolic_bp: float = Field(..., ge=50, le=300)
    diastolic_bp: float = Field(..., ge=20, le=200)
    cholesterol: float = Field(..., ge=50, le=600)


@router.post("/predict/diabetes")
def diabetes_prediction(data: DiabetesInput):

    try:
        health_data = {
            "RIDAGEYR": data.age,
            "RIAGENDR": data.gender,
            "BMXBMI": data.bmi,
            "BPXOSY1": data.systolic_bp,
            "BPXODI1": data.diastolic_bp,
            "LBXTC": data.cholesterol,
        }

        result = predict_diabetes(health_data)

        return {
            "status": "success",
            "data": result,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}",
        )