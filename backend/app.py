from flask import Flask, request, jsonify
from SPARQLWrapper import SPARQLWrapper, JSON
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Permet les requêtes Cross-Origin depuis le frontend


# URL de l'endpoint SPARQL de Fuseki
SPARQL_ENDPOINT = "http://localhost:3030/dataset"  
@app.route("/query", methods=["POST"])
def query():
    """
    Exécute une requête SPARQL envoyée par le frontend.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is empty"}), 400
    
    sparql_query = data.get("query")
    if not sparql_query:
        return jsonify({"error": "No SPARQL query provided"}), 400

    sparql = SPARQLWrapper(SPARQL_ENDPOINT)
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)

    try:
        results = sparql.query().convert()
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": f"Failed to execute query: {str(e)}"}), 500

@app.route("/update", methods=["POST"])
def update():
    """
    Exécute une requête SPARQL Update envoyée par le frontend.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is empty"}), 400

    sparql_update = data.get("update")
    if not sparql_update:
        return jsonify({"error": "No SPARQL update query provided"}), 400

    sparql = SPARQLWrapper(SPARQL_ENDPOINT)
    sparql.setQuery(sparql_update)  # Utilisez setQuery pour l'update également
    sparql.setMethod("POST")  # Méthode POST pour update

    try:
        sparql.query()  # Exécute la requête
        return jsonify({"status": "Update executed successfully"})
    except Exception as e:
        return jsonify({"error": f"Failed to execute update: {str(e)}"}), 500

@app.route("/search", methods=["POST"])
def search_products():
    """
    Recherche et filtre des produits selon les critères envoyés par le frontend.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is empty"}), 400

    name = data.get("name", "").strip()
    category = data.get("category", "").strip()
    min_price = data.get("min_price")
    max_price = data.get("max_price")

    filters = []
    if name:
        filters.append(f"?productName = '{name}'")
    if category:
        filters.append(f"?category = '{category}'")
    if min_price:
        filters.append(f"?price >= {min_price}")
    if max_price:
        filters.append(f"?price <= {max_price}")

    filter_clause = " && ".join(filters) if filters else "true"

    sparql_query = f"""
    SELECT ?productName ?category ?price
    WHERE {{
        ?product a :Product .
        ?product :name ?productName .
        ?product :category ?category .
        ?product :price ?price .
        FILTER ({filter_clause})
    }}
    """

    sparql = SPARQLWrapper(SPARQL_ENDPOINT)
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)

    try:
        results = sparql.query().convert()
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": f"Failed to execute search: {str(e)}"}), 500

@app.route("/favicon.ico")
def favicon():
    """
    Route pour éviter l'erreur 404 pour /favicon.ico.
    """
    return '', 204

if __name__ == "__main__":
    app.run(debug=True, port=5000)