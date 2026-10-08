
from pathlib import Path
import pandas as pd

# Project paths
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = PROJECT_ROOT / "data" / "processed" / "nhanes_merged.csv"
OUTPUT_DIR = PROJECT_ROOT / "data" / "processed"

# Load the integrated dataset
df = pd.read_csv(DATA_FILE)

# Calculate missing-value statistics
missing_count = df.isna().sum()
missing_percent = (missing_count / len(df)) * 100

missing_report = pd.DataFrame({
    "column": df.columns,
    "missing_count": missing_count.values,
    "missing_percent": missing_percent.values
})

# Show columns with missing values, highest percentage first
missing_report = missing_report[
    missing_report["missing_count"] > 0
].sort_values("missing_percent", ascending=False)

# Save the report
report_file = OUTPUT_DIR / "missing_values_report.csv"
missing_report.to_csv(report_file, index=False)

# Display the most affected columns
print("Dataset shape:", df.shape)
print("Total missing cells:", int(df.isna().sum().sum()))
print("\nTop 20 columns with missing values:")
print(missing_report.head(20).to_string(index=False))

print("\nMissing-value report saved to:")
print(report_file)