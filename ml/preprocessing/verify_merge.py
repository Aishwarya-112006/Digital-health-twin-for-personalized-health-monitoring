
from pathlib import Path
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

# Load original body measurements
bmx = pd.read_sas(
    RAW_DIR / "BMX_L.xpt",
    format="xport",
    encoding="latin1"
)

# Load integrated dataset
merged = pd.read_csv(PROCESSED_DIR / "nhanes_merged.csv")

# Check body measurements in the original and merged data
variables = ["BMXWT", "BMXHT", "BMXBMI", "BMXWAIST"]

print("Original BMX rows:", len(bmx))
print("Merged rows:", len(merged))

print("\nNon-missing counts:")
for variable in variables:
    if variable in bmx.columns and variable in merged.columns:
        print(
            f"{variable}: "
            f"original = {bmx[variable].notna().sum()}, "
            f"merged = {merged[variable].notna().sum()}"
        )

# Confirm that all original BMX participant IDs appear in the merged data
original_ids = set(bmx["SEQN"].dropna())
merged_ids = set(merged["SEQN"].dropna())

print("\nOriginal BMX IDs:", len(original_ids))
print("BMX IDs found in merged data:", len(original_ids & merged_ids))
print("BMX IDs missing from merged data:", len(original_ids - merged_ids))