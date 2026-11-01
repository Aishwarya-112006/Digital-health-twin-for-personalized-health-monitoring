import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

# 1. Load dataset and trained model

df = pd.read_csv("data/processed/diabetes_ml_dataset.csv")

model = joblib.load("ml/diabetes/diabetes_model.pkl")


# 2. Separate features and target

X = df.drop("Diabetes", axis=1)
y = df["Diabetes"]


# 3. Recreate the same test split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# 4. Get diabetes probabilities

probabilities = model.predict_proba(X_test)[:, 1]


# 5. Compare different thresholds

thresholds = [0.5, 0.4, 0.3, 0.2]

for threshold in thresholds:

    predictions = (probabilities >= threshold).astype(int)

    print("\nThreshold:", threshold)

    print("Precision:",
          round(precision_score(y_test, predictions), 3))

    print("Recall:",
          round(recall_score(y_test, predictions), 3))

    print("F1 Score:",
          round(f1_score(y_test, predictions), 3))

    print("Confusion Matrix:")
    print(confusion_matrix(y_test, predictions))
