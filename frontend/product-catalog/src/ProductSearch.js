
import axios from "axios";
import React, { useState } from "react";

const ProductSearch = () => {
    const [type, setType] = useState("");
    const [brand, setBrand] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
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
        formGroup: {
          marginBottom: "15px",
        },
        label: {
          fontWeight: "bold",
          marginRight: "10px",
        },
        input: {
          padding: "8px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid #ccc",
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

        // Construire la requête SPARQL
        const sparqlQuery = `
          PREFIX ex: <http://example.org#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

          SELECT ?product ?brand ?price ?specification
          WHERE {
            ?product rdf:type ex:${type} ;
                     ex:hasBrand ?brand ;
                     ex:hasPrice ?price ;
                     ex:hasSpecification ?specification .
            ${brand ? `FILTER(CONTAINS(LCASE(?brand), LCASE("${brand}")))` : ""}
            ${minPrice ? `FILTER(xsd:decimal(?price) >= ${minPrice})` : ""}
            ${maxPrice ? `FILTER(xsd:decimal(?price) <= ${maxPrice})` : ""}
          }
        `;

        try {
            const response = await axios.post("http://localhost:5000/query", {
                query: sparqlQuery,
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
            <h2 style={styles.title}>Search for Products</h2>
            <div style={styles.formGroup}>
                <label style={styles.label}>Product Type:</label>
                <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g., Electronics, Clothing, AutoParts"
                    style={styles.input}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label style={styles.label}>Brand:</label>
                <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g., BrandA, BrandB"
                    style={styles.input}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label style={styles.label}>Min Price:</label>
                <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={styles.input}
                />
                <label style={styles.label}>Max Price:</label>
                <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={styles.input}
                />
            </div>
            <button onClick={executeQuery} style={styles.button}>
            Search
            </button>
            {error && (
                <div style={{ color: "red", marginTop: "10px" }}>
                    <strong>Error:</strong> {error}
                </div>
            )}
            {results.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3 style={styles.results}>Results :</h3>
                    <table border="1" cellPadding="5" style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}> Product</th>
                                <th style={styles.th}>Brand</th>
                                <th style={styles.th}>Price</th>
                                <th style={styles.th}>Specifications</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, idx) => (
                                <tr key={idx}>
                                    <td style={styles.td}>{result.product.value}</td>
                                    <td style={styles.td}>{result.brand.value}</td>
                                    <td style={styles.td}>{result.price.value}</td>
                                    <td style={styles.td}>{result.specification.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductSearch;
