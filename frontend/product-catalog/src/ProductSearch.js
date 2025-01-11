
import axios from "axios";
import React, { useState } from "react";

const ProductSearch = () => {
    const [type, setType] = useState("");
    const [brand, setBrand] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

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
        <div style={{ padding: "20px" }}>
            <h2>Rechercher des Produits</h2>
            <div style={{ marginBottom: "10px" }}>
                <label>Type de Produit:</label>
                <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g., Electronics, Clothing, AutoParts"
                    style={{ marginLeft: "10px" }}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Marque:</label>
                <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g., BrandA, BrandB"
                    style={{ marginLeft: "10px" }}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Prix Min:</label>
                <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{ marginLeft: "10px" }}
                />
                <label style={{ marginLeft: "20px" }}>Prix Max:</label>
                <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{ marginLeft: "10px" }}
                />
            </div>
            <button onClick={executeQuery} style={{ marginTop: "10px" }}>
                Rechercher
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
                                <th>Produit</th>
                                <th>Marque</th>
                                <th>Prix</th>
                                <th>Spécifications</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, idx) => (
                                <tr key={idx}>
                                    <td>{result.product.value}</td>
                                    <td>{result.brand.value}</td>
                                    <td>{result.price.value}</td>
                                    <td>{result.specification.value}</td>
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
