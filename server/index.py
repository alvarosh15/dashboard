from flask import jsonify
from app import create_app
from app.models.score import Score

app = create_app()

@app.route('/')
def get_scores():
    scores = Score.query.all()
    
    score_list = [{"ScoreId": score.ScoreId, "ScoreName": score.ScoreName} for score in scores]
    
    return jsonify(score_list)

if __name__ == "__main__":
    app.run(debug=True, port=8080)
