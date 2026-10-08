
from pathlib import Path
import pandas as pd

# Find the project directory
PROJECT_ROOT = Path(__file__).resolve().parents[2]

RAW_DIR = PROJECT_ROOT / "data" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

# Create the output directory if it does not exist
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

# NHANES files selected for this project
dataset_files = [
    "DEMO_L.xpt",
    "BMX_L.xpt",
    "BPXO_L.xpt",
    "DIQ_L.xpt",
    "GHB_L.xpt",
    "TCHOL_L.xpt",
    "HSQ_L.xpt",
]

dataframes = []
report_lines = []

# Read each dataset
for filename in dataset_files:
    file_path = RAW_DIR / filename

    if not file_path.exists():
        raise FileNotFoundError(f"Dataset not found: {file_path}")

    df = pd.read_sas(
        file_path,
        format="xport",
        encoding="latin1"
    )

    # Standardize participant ID formatting
    if "SEQN" not in df.columns:
        raise ValueError(f"SEQN column missing from {filename}")

    print(f"\nLoaded: {filename}")
    print(f"Rows: {len(df)}, Columns: {len(df.columns)}")

    # Record initial dataset details
    report_lines.append(f"Dataset: {filename}")
    report_lines.append(f"Rows: {len(df)}")
    report_lines.append(f"Columns: {len(df.columns)}")
    report_lines.append(
        f"Duplicate SEQN values: {df['SEQN'].duplicated().sum()}"
    )
    report_lines.append(
        f"Missing cells: {int(df.isna().sum().sum())}"
    )
    report_lines.append("")

    dataframes.append((filename, df))

# Use DEMO_L as the base participant table
base_df = dict(dataframes)["DEMO_L.xpt"].copy()

# Check that the base participant IDs are unique
if base_df["SEQN"].duplicated().any():
    raise ValueError("DEMO_L contains duplicate SEQN values.")

# Merge the remaining datasets using left joins
merged_df = base_df.copy()

for filename, df in dataframes:
    if filename == "DEMO_L.xpt":
        continue

    # Prevent accidental many-to-many merges
    if df["SEQN"].duplicated().any():
        raise ValueError(
            f"{filename} contains duplicate SEQN values. "
            "Review this dataset before merging."
        )

    # Keep the base participant list and add available information
    merged_df = merged_df.merge(
        df,
        on="SEQN",
        how="left",
        suffixes=("", f"_{filename.replace('.xpt', '')}"),
        validate="one_to_one"
    )

# Save the integrated dataset
output_csv = PROCESSED_DIR / "nhanes_merged.csv"
merged_df.to_csv(output_csv, index=False)

# Add merged dataset summary
report_lines.append("INTEGRATED DATASET")
report_lines.append(f"Rows: {len(merged_df)}")
report_lines.append(f"Columns: {len(merged_df.columns)}")
report_lines.append(
    f"Unique participants: {merged_df['SEQN'].nunique()}"
)
report_lines.append(
    f"Duplicate participant IDs: {merged_df['SEQN'].duplicated().sum()}"
)
report_lines.append(
    f"Missing cells: {int(merged_df.isna().sum().sum())}"
)

# Save a preprocessing report
report_path = PROCESSED_DIR / "preprocessing_report.txt"
report_path.write_text("\n".join(report_lines), encoding="utf-8")

print("\nPreprocessing completed.")
print("Integrated dataset:", output_csv)
print("Report:", report_path)
print("Final shape:", merged_df.shape)