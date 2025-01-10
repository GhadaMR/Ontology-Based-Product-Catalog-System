// src/SparqlQuery.js
import React, { useState } from "react";
import axios from "axios";

const SparqlQuery = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const executeQuery = async () => {
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/query", {
        query: query,
      });
      if (response.data.results) {
        setResults(response.data.results.bindings);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Exécuter une Requête SPARQL</h2>
      <textarea
        style={{ width: "100%", height: "150px" }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Écrivez votre requête SPARQL ici"
      />
      <br />
      <button onClick={executeQuery} style={{ marginTop: "10px" }}>
        Exécuter la Requête
      </button>
      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <strong>Erreur:</strong> {error}
        </div>
      )}
      {results.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Résultats :</h3>
          <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                {Object.keys(results[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr key={idx}>
                  {Object.values(result).map((val, i) => (
                    <td key={i}>{val.value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SparqlQuery;
