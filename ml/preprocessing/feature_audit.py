
from pathlib import Path
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = PROJECT_ROOT / "data" / "processed" / "nhanes_merged.csv"
OUTPUT_DIR = PROJECT_ROOT / "data" / "processed"

df = pd.read_csv(DATA_FILE)

# Candidate variables relevant to the health profile.
# The script checks which variables actually exist in the dataset.
candidate_features = [
    "SEQN",
    "RIDAGEYR", "RIAGENDR", "RIDRETH3",
    "BMXWT", "BMXHT", "BMXBMI", "BMXWAIST",
    "BPXOSY1", "BPXODI1",
    "DIQ010", "DIQ050", "DIQ070",
    "LBXGH", "LBXTC",
    "HSQ590"
]

available = [col for col in candidate_features if col in df.columns]
missing = [col for col in candidate_features if col not in df.columns]

# Summarize data availability
report = pd.DataFrame({
    "variable": available,
    "non_missing_count": [df[col].notna().sum() for col in available],
    "missing_count": [df[col].isna().sum() for col in available],
    "missing_percent": [
        round(df[col].isna().mean() * 100, 2)
        for col in available
    ],
    "unique_values": [df[col].nunique(dropna=True) for col in available]
})

report = report.sort_values("missing_percent")

output_file = OUTPUT_DIR / "candidate_feature_audit.csv"
report.to_csv(output_file, index=False)

print("Dataset shape:", df.shape)
print("\nCandidate feature audit:")
print(report.to_string(index=False))

if missing:
    print("\nCandidate names not found in this dataset:")
    print(missing)

print("\nReport saved to:", output_file)