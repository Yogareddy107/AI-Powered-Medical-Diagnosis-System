from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/diagnose", methods=["POST"])
def diagnose():
    data = request.get_json()
    
    # Check if "symptoms" key is present in the request
    if not data or "symptoms" not in data:
        return jsonify({"error": "No symptoms provided"}), 400

    symptoms = data["symptoms"].lower()  # Convert symptoms to lowercase for case-insensitive matching

    # AI-based diagnosis logic
    if "fever" in symptoms:
        diagnosis = "Flu"
    elif "headache" in symptoms:
        diagnosis = "Migraine"
    elif "cough" in symptoms:
        diagnosis = "Cold"
    else:
        diagnosis = "Unknown Condition"

    return jsonify({"diagnosis": diagnosis})

if __name__ == "__main__":
    app.run(port=9090, debug=True)
