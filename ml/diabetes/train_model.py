import pandas as pd
import joblib
import json

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    roc_auc_score,
    precision_score,
    recall_score,
    f1_score
)


# ==========================================
# 1. LOAD PREPARED DATASET
# ==========================================

df = pd.read_csv("data/processed/diabetes_ml_dataset.csv")

print("Dataset Shape:", df.shape)


# ==========================================
# 2. SEPARATE FEATURES AND TARGET
# ==========================================

X = df.drop("Diabetes", axis=1)
y = df["Diabetes"]

numeric_features = [
    "RIDAGEYR",
    "BMXBMI",
    "BPXOSY1",
    "BPXODI1",
    "LBXTC"
]

categorical_features = ["RIAGENDR"]


# ==========================================
# 3. PREPROCESSING
# ==========================================

numeric_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median"))
])

categorical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer(transformers=[
    ("num", numeric_transformer, numeric_features),
    ("cat", categorical_transformer, categorical_features)
])


# ==========================================
# 4. TRAIN-VALIDATION-TEST SPLIT
# ==========================================

# First: 60% training and 40% temporary data

X_train, X_temp, y_train, y_temp = train_test_split(
    X,
    y,
    test_size=0.40,
    random_state=42,
    stratify=y
)

# Second: 20% validation and 20% testing

X_val, X_test, y_val, y_test = train_test_split(
    X_temp,
    y_temp,
    test_size=0.50,
    random_state=42,
    stratify=y_temp
)

print("\nTraining records:", len(X_train))
print("Validation records:", len(X_val))
print("Testing records:", len(X_test))


# ==========================================
# 5. BUILD MODEL PIPELINE
# ==========================================

model = Pipeline(steps=[
    ("preprocessor", preprocessor),

    ("classifier", RandomForestClassifier(
        n_estimators=200,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    ))
])


# ==========================================
# 6. TRAIN MODEL
# ==========================================

print("\nTraining model...")

model.fit(X_train, y_train)

print("Training completed!")


# ==========================================
# 7. SELECT THRESHOLD USING VALIDATION DATA
# ==========================================

# Get diabetes probabilities for validation data

val_prob = model.predict_proba(X_val)[:, 1]

thresholds = [0.5, 0.4, 0.3, 0.2]

print("\nVALIDATION RESULTS")

for threshold in thresholds:

    val_pred = (val_prob >= threshold).astype(int)

    precision = precision_score(
        y_val, val_pred, zero_division=0
    )

    recall = recall_score(
        y_val, val_pred, zero_division=0
    )

    f1 = f1_score(
        y_val, val_pred, zero_division=0
    )

    print("\nThreshold:", threshold)
    print("Precision:", round(precision, 3))
    print("Recall:", round(recall, 3))
    print("F1 Score:", round(f1, 3))


# ==========================================
# 8. FINAL EVALUATION ON TEST DATA
# ==========================================

# Selected using validation results:
# Threshold 0.2 gave the highest F1-score.

final_threshold = 0.2

# Get diabetes probabilities for test data

test_prob = model.predict_proba(X_test)[:, 1]

# Convert probabilities into predictions

y_pred = (test_prob >= final_threshold).astype(int)

print("\nFINAL TEST RESULTS")

print("Selected Threshold:", final_threshold)

print("\nAccuracy:", round(
    accuracy_score(y_test, y_pred), 4
))

print("\nClassification Report:")

print(classification_report(
    y_test,
    y_pred,
    target_names=["No Diabetes", "Diabetes"],
    zero_division=0
))

print("\nConfusion Matrix:")

print(confusion_matrix(y_test, y_pred))

print("\nROC-AUC:", round(
    roc_auc_score(y_test, test_prob), 4
))


# ==========================================
# 9. SAVE TRAINED MODEL
# ==========================================

joblib.dump(model, "ml/diabetes/diabetes_model.pkl")

print("\nModel saved at: ml/diabetes/diabetes_model.pkl")


# Save selected prediction threshold

config = {
    "threshold": final_threshold,
    "target": "Diabetes",
    "model": "RandomForestClassifier"
}

with open("ml/diabetes/model_config.json", "w") as file:
    json.dump(config, file, indent=4)

print("Model configuration saved!")