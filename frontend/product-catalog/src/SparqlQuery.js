// src/SparqlQuery.js
import axios from "axios";
import React, { useState } from "react";

const SparqlQuery = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const styles = {
    container: {
      padding: "20px",
      fontFamily: "'Roboto', sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    title: {
      textAlign: "center",
      color: "#333",
      marginBottom: "20px",
    },
    textarea: {
      width: "100%",
      height: "150px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "10px",
      fontSize: "16px",
    },
    button: {
      marginTop: "10px",
      padding: "10px 20px",
      fontSize: "16px",
      color: "#fff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    error: {
      color: "#e74c3c",
      marginTop: "10px",
      fontWeight: "bold",
    },
    results: {
      marginTop: "20px",
    },
    table: {
      borderCollapse: "collapse",
      width: "100%",
    },
    th: {
      backgroundColor: "#f4f4f4",
      padding: "10px",
      textAlign: "left",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
    },
  };

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
    <div style={styles.container}>
      <h2 style={styles.title}>Execute a SPARQL Query</h2>
      <textarea
        style={styles.textarea}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="write yoour SPARQL query here... "
      />
      <br />
      <button onClick={executeQuery} style={styles.button}>
      Execute Query
      </button>
      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}
      {results.length > 0 && (
        <div style={styles.results}>
          <h3>Results :</h3>
          <table border="1" cellPadding="5" style={styles.table}>
            <thead>
              <tr>
                {Object.keys(results[0]).map((key) => (
                  <th key={key} style={styles.th}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr key={idx}>
                  {Object.values(result).map((val, i) => (
                    <td key={i} style={styles.td}>{val.value}</td>
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
