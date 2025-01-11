// src/App.js
import React from "react";
import SparqlQuery from "./SparqlQuery";
import ProductSearch from "./ProductSearch";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Catalogue de Produits Basé sur une Ontologie</h1>
      <ProductSearch />
      <SparqlQuery />
    </div>
  );
}

export default App;
