"""MindCare local API. No database persistence; request bodies are never logged here."""
import random

from flask import Flask, jsonify, request
from flask_cors import CORS
from screening import score_check_in

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024  # reject unexpectedly large JSON bodies
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "mindcare-api"})


@app.post("/api/check-in")
def check_in():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Request body must be a JSON object"}), 400
    try:
        result = score_check_in(payload.get("answers"))
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    # Deliberately stateless: no database write, no text journal, no account required.
    return jsonify(result)


@app.get("/api/affirmation")
def affirmation():
    messages = [
        "I can take this one gentle step at a time.",
        "My feelings are valid, and I do not need to solve everything today.",
        "I am allowed to rest, reflect, and begin again.",
        "Small progress still counts, and I can choose one kind action for myself.",
        "I deserve care, patience, and the space to breathe.",
    ]
    return jsonify({"message": random.choice(messages)})


@app.post("/api/language-signal")
def language_signal_not_ready():
    """Placeholder endpoint: never guesses; returns a clear response until a model is evaluated."""
    return jsonify({
        "error": "language_signal_not_configured",
        "message": "The research NLP model has not been trained and evaluated yet.",
        "notice": "Do not use a text classifier to diagnose a person or assess immediate danger.",
    }), 503


@app.errorhandler(413)
def payload_too_large(_error):
    return jsonify({"error": "Request body is too large"}), 413


if __name__ == "__main__":

    app.run(host="127.0.0.1", port=5000, debug=True)
