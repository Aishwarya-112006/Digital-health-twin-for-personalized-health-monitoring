
from pathlib import Path
import pandas as pd


# Project directories
PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw"

# NHANES files selected for the project
dataset_files = [
    "DEMO_L.xpt",
    "BMX_L.xpt",
    "BPXO_L.xpt",
    "DIQ_L.xpt",
    "GHB_L.xpt",
    "TCHOL_L.xpt",
    "HSQ_L.xpt",
]

for filename in dataset_files:
    file_path = RAW_DIR / filename

    print("\n" + "=" * 60)
    print(f"Dataset: {filename}")
    print("=" * 60)

    if not file_path.exists():
        print("FILE NOT FOUND:", file_path)
        continue

    # Read the XPT file
    df = pd.read_sas(
    file_path,
    format="xport",
    encoding="latin1"
)

    print("Rows:", df.shape[0])
    print("Columns:", df.shape[1])

    print("\nColumn names:")
    print(df.columns.tolist())

    print("\nFirst 5 rows:")
    print(df.head())

    print("\nMissing values in columns:")
    print(df.isnull().sum().to_string())

    if "SEQN" in df.columns:
        print("\nUnique participants:", df["SEQN"].nunique())
        print("Duplicate participant IDs:", df["SEQN"].duplicated().sum())
    else:
        print("\nWARNING: SEQN column not found.")