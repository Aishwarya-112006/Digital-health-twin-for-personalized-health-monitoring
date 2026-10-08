
from pathlib import Path
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw"

files = ["BMX_L.xpt", "DIQ_L.xpt", "DEMO_L.xpt"]

for filename in files:
    file_path = RAW_DIR / filename

    print("\n" + "=" * 60)
    print("FILE:", filename)
    print("=" * 60)

    df = pd.read_sas(
        file_path,
        format="xport",
        encoding="latin1"
    )

    print("Shape:", df.shape)
    print("\nColumn names:")
    print(df.columns.tolist())

    print("\nNon-missing values per column:")
    print(df.notna().sum().to_string())

    # Inspect a few important variables if present
    check_names = [
        "SEQN", "BMXWT", "BMXHT", "BMXBMI",
        "BMXWAIST", "BMXHEAD", "BMIWT", "BMIHEAD",
        "DIQ010", "DIQ050", "DIQ060U", "RIDAGEYR"
    ]

    available = [c for c in check_names if c in df.columns]

    if available:
        print("\nSample values:")
        print(df[available].head(10).to_string(index=False))