import React, { useState } from 'react';
import './App.css';

function App() {
  const [features, setFeatures] = useState(["", "", "", ""]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      const response = await fetch("https://stock-predictor-service-530633117369.us-central1.run.app/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          features: features.map(Number)
        })
      });

      const data = await response.json();

      if (data.prediction) {
        setPrediction(data.prediction[0]);
      } else if (data.error) {
        setPrediction("Error: " + data.error);
      }
    } catch (error) {
      setPrediction("Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Stock Price Prediction</h1>
      <form onSubmit={handleSubmit}>
        <br/>
        <input
          key={0}
          type="number"
          value={features[0]}
          placeholder="Open price.."
          onChange={(e) => handleChange(0, e.target.value)}
          title="Open: The price at which the stock opened trading on that day."
          required
        />
        <input
          key={1}
          type="number"
          value={features[1]}
          placeholder="Highest price.."
          onChange={(e) => handleChange(1, e.target.value)}
          title="High: The highest price the stock reached during that trading day."
          required
        />
        <input
          key={2}
          type="number"
          value={features[2]}
          placeholder="Lowest price.."
          onChange={(e) => handleChange(2, e.target.value)}
          title="Low: The lowest price the stock fell to during that day."
          required
        />
        <input
          key={3}
          type="number"
          value={features[3]}
          placeholder="Volume traded today.."
          onChange={(e) => handleChange(3, e.target.value)}
          title="Volume: The total number of shares traded on that particular day."
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Submit"}
        </button>
      </form>

      {prediction !== null && (
        <div className="result">
          <strong>Prediction:</strong> {prediction}
        </div>
      )}
    </div>
  );
}

export default App;
