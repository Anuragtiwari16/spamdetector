import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

# Dataset path
data = pd.read_csv(
    "dataset/SMSSpamCollection",
    sep="\t",
    names=["label", "message"]
)

# Convert labels
data["label"] = data["label"].map({"ham": 0, "spam": 1})

# Features and target
X = data["message"]
y = data["label"]

# TF-IDF Vectorizer
vectorizer = TfidfVectorizer(stop_words="english")
X = vectorizer.fit_transform(X)

# Train Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train Model
model = MultinomialNB()
model.fit(X_train, y_train)

# Accuracy
pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, pred))

# Save Model
os.makedirs("model", exist_ok=True)

joblib.dump(model, "model/model.pkl")
joblib.dump(vectorizer, "model/vectorizer.pkl")

print("Model Saved Successfully!")