import React, { useState } from "react";
import Diagnosis from "./Diagnosis";
import { FiMenu } from "react-icons/fi";
import { FaSearch } from "react-icons/fa"; // Removed FaUserMd
import "./App.css"; // Import custom styles

function App() {
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDiagnosis = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:9090/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) throw new Error("Failed to fetch diagnosis");

      const data = await response.json();
      setDiagnosis(data.diagnosis);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="App Logo" className="app-logo" />
          <h1>AI Medical Diagnosis</h1>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search symptoms, diseases..." />
          <button>
            <FaSearch />
          </button>
        </div>
        <div className="menu">
          <FiMenu className="menu-icon" />
        </div>
      </header>

      {/* Main Content */}
      <div className="content">
        <h2>Enter Symptoms</h2>
        <input
          type="text"
          className="input-box"
          placeholder="E.g. fever, headache..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <button className="diagnose-btn" onClick={handleDiagnosis} disabled={loading}>
          {loading ? "Analyzing..." : "Get Diagnosis"}
        </button>

        {error && <p className="error-text">{error}</p>}

        {/* Diagnosis Result */}
        {diagnosis && (
          <div className="diagnosis-result">
            <h2>Diagnosis: <span className="diagnosis-name">{diagnosis}</span></h2>
          </div>
        )}

        <Diagnosis />
      </div>
    </div>
  );
}

export default App;
