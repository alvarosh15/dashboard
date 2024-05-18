from flask import Blueprint, jsonify, request
from app.models.history import History, InputType
from app.database import db
from flask_jwt_extended import jwt_required, get_jwt_identity

history_bp = Blueprint('history_bp', __name__)

@history_bp.route('/history', methods=['POST'])
@jwt_required()
def set_history():
    try:
        user_id = get_jwt_identity().get('id')
        data = request.get_json()
        inputs = data.get('input')
        type_str = data.get('type')
        
        if not inputs or not type_str:
            return jsonify({"message": "Invalid data"}), 400
        
        input_type = InputType.query.filter_by(Type=type_str).first()
        if not input_type:
            return jsonify({"message": "Invalid input type"}), 400
        
        new_history = History(UserId=user_id, Inputs=inputs, TypeId=input_type.Id)
        db.session.add(new_history)
        db.session.commit()
        
        return jsonify({"message": "Input added successfully"}), 201
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

@history_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    try:
        user_id = get_jwt_identity().get('id')
        
        history_data = {
            'Route': [],
            'Stop': [],
            'Package': []
        }
        
        for type_str in history_data.keys():
            input_type = InputType.query.filter_by(Type=type_str).first()
            if input_type:
                histories = History.query.filter_by(UserId=user_id, TypeId=input_type.Id).order_by(History.Id.desc()).order_by(History.AddedAt.desc()).limit(5).all()
                history_data[type_str] = [history.Inputs for history in histories]
        
        return jsonify(history_data), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500