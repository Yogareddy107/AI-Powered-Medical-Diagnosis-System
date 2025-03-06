const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define symptom-disease mapping
const diseaseDatabase = {
    "fever, cough": "Common Cold",
    "fever, headache": "Dengue",
    "fever, headache, cough": "COVID-19",
    "headache, nausea": "Migraine",
    "cough, sore throat": "Flu",
};

app.post("/api/diagnose", (req, res) => {
    const { symptoms } = req.body;
    const formattedSymptoms = symptoms.toLowerCase().replace(/\s+/g, "").split(",");
    
    // Search for a matching condition
    let diagnosis = "Unknown Condition";
    for (let key in diseaseDatabase) {
        const storedSymptoms = key.split(", ");
        if (storedSymptoms.every(symptom => formattedSymptoms.includes(symptom))) {
            diagnosis = diseaseDatabase[key];
            break;
        }
    }

    res.json({ diagnosis });
});

app.listen(9090, () => console.log("Server running on port 9090"));
