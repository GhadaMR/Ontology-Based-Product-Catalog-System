import React from "react";
import SparqlQuery from "./SparqlQuery";
import ProductSearch from "./ProductSearch";

function App() {
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
  };
  
  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Ontology-Based Product Catalog</h1>
      <ProductSearch />
      <SparqlQuery />
    </div>
  );
}

export default App;
