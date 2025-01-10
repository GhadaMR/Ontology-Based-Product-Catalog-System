from flask import Flask, request, jsonify
from SPARQLWrapper import SPARQLWrapper, JSON
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Permet les requêtes Cross-Origin depuis le frontend


# URL de l'endpoint SPARQL de Fuseki
SPARQL_ENDPOINT = "http://localhost:3030/dataset"  # Point d'update au lieu de "sparql"
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

@app.route("/favicon.ico")
def favicon():
    """
    Route pour éviter l'erreur 404 pour /favicon.ico.
    """
    return '', 204

if __name__ == "__main__":
    app.run(debug=True, port=5000)