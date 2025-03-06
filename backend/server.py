from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client.medical_database
records_collection = db.patient_records

# Sample dataset (Symptoms & Diseases)
data = {
    "fever": [1, 0, 1, 0, 1],
    "cough": [1, 1, 0, 0, 1],
    "headache": [0, 1, 1, 0, 0],
    "body_pain": [0, 0, 1, 1, 0],
    "disease": ["Flu", "Migraine", "Cold", "Body Pain Syndrome", "Covid-19"]
}

df = pd.DataFrame(data)

# Convert symptoms into features & target labels
X = df.drop(columns=["disease"])  # Symptoms
y = df["disease"]  # Diagnosis Labels

# Train AI Model
model = DecisionTreeClassifier()
model.fit(X, y)

@app.route("/api/diagnose", methods=["POST"])
def diagnose():
    data = request.get_json()
    symptoms_input = data.get("symptoms", "").lower().split(", ")

    # Convert input symptoms to a feature vector
    symptom_vector = [1 if symptom in symptoms_input else 0 for symptom in X.columns]

    # Predict disease
    prediction = model.predict([symptom_vector])[0]

    # Save to MongoDB
    patient_record = {"symptoms": symptoms_input, "diagnosis": prediction}
    records_collection.insert_one(patient_record)

    return jsonify({"diagnosis": prediction})

# Route to fetch past diagnosis records
@app.route("/api/records", methods=["GET"])
def get_records():
    records = list(records_collection.find({}, {"_id": 0}))  # Exclude MongoDB ObjectId
    return jsonify(records)

if __name__ == "__main__":
    app.run(port=9090, debug=True)
