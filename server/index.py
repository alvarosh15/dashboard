from flask import jsonify
from app import create_app
from app.models.score import Score

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=8080)
