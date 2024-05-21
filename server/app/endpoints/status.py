from flask import Blueprint, jsonify
from app.models import Status

status_bp = Blueprint('status_bp', __name__)

@status_bp.route('/status', methods=['GET'])
def return_status():
    try:
        status = Status.query.all()

        status_list = [{"StatusId": state.status_id, "StatusName": state.status_name} for state in status]

        return jsonify({"data": status_list}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}, 500)
