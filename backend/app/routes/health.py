from pathlib import Path

import pandas as pd
from fastapi import APIRouter, HTTPException

router = APIRouter()

PROJECT_ROOT = Path(__file__).resolve().parents[3]
DATA_PATH = PROJECT_ROOT / "data" / "processed" / "nhanes_merged.csv"

HEALTH_COLUMNS = [
    "RIDAGEYR",
    "RIAGENDR",
    "BMXWT",
    "BMXHT",
    "BMXBMI",
    "BPXOSY1",
    "BPXODI1",
    "DIQ010",
    "LBXGH",
    "LBXTC",
]


def load_data():
    if not DATA_PATH.exists():
        raise HTTPException(
            status_code=500,
            detail="Processed NHANES dataset was not found."
        )

    return pd.read_csv(DATA_PATH)


def clean_value(value):
    if pd.isna(value):
        return None
    return value.item() if hasattr(value, "item") else value


@router.get("/participants")
def get_participants(limit: int = 20):
    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=400,
            detail="Limit must be between 1 and 100."
        )

    df = load_data()

    return [
        {"SEQN": clean_value(row["SEQN"])}
        for _, row in df[["SEQN"]].dropna().head(limit).iterrows()
    ]


@router.get("/participants/{participant_id}")
def get_participant(participant_id: float):
    df = load_data()

    participant = df.loc[df["SEQN"] == participant_id]

    if participant.empty:
        raise HTTPException(
            status_code=404,
            detail="Participant not found."
        )

    row = participant.iloc[0]

    health_data = {
        column: clean_value(row[column])
        for column in HEALTH_COLUMNS
        if column in df.columns
    }

    return {
        "participant_id": clean_value(row["SEQN"]),
        "health_data": health_data,
    }
