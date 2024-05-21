from flask import Blueprint, jsonify
from app.models import Score

score_bp = Blueprint('score_bp', __name__)

@score_bp.route('/scores', methods=['GET'])
def return_scores():
    try:
        scores = Score.query.all()

        scores_list = [{"ScoreId": score.score_id, "ScoreName": score.score_name} for score in scores]

        return jsonify({"data": scores_list}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}, 500)
