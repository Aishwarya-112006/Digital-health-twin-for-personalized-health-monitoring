import pandas as pd

# ==========================================
# 1. LOAD PROCESSED NHANES DATASET
# ==========================================

df = pd.read_csv("data/processed/nhanes_merged.csv")

print("Original Dataset Shape:", df.shape)


# ==========================================
# 2. SELECT INPUT FEATURES
# ==========================================

features = [
    "RIDAGEYR",   # Age
    "RIAGENDR",   # Gender
    "BMXBMI",     # Body Mass Index
    "BPXOSY1",    # Systolic Blood Pressure
    "BPXODI1",    # Diastolic Blood Pressure
    "LBXTC"       # Total Cholesterol
]


# ==========================================
# 3. FILTER VALID DIABETES RESPONSES
# ==========================================

# DIQ010 = 1: Yes, diagnosed with diabetes
# DIQ010 = 2: No

ml_df = df[df["DIQ010"].isin([1, 2])].copy()


# ==========================================
# 4. CONVERT TARGET INTO BINARY LABELS
# ==========================================

# 1 = Diabetes
# 0 = No Diabetes

ml_df["Diabetes"] = ml_df["DIQ010"].map({
    1: 1,
    2: 0
})


# ==========================================
# 5. CREATE ML DATASET
# ==========================================

ml_df = ml_df[features + ["Diabetes"]]


# ==========================================
# 6. DISPLAY DATASET INFORMATION
# ==========================================

print("\nML Dataset Shape:", ml_df.shape)

print("\nFirst 5 Rows:")
print(ml_df.head())

print("\nMissing Values:")
print(ml_df.isnull().sum())

print("\nTarget Distribution:")
print(ml_df["Diabetes"].value_counts())


# ==========================================
# 7. SAVE PREPARED DATASET
# ==========================================

output_path = "data/processed/diabetes_ml_dataset.csv"

ml_df.to_csv(output_path, index=False)

print("\nPrepared dataset saved at:", output_path)