from flask import Blueprint, jsonify
from app.models.type import Type

type_bp = Blueprint('type_bp', __name__)

@type_bp.route('/types', methods=['GET'])
def return_types():
    try:
        types = Type.query.all()

        types_list = [{"TypeId": type.TypeId, "TypeName": type.TypeName} for type in types]

        return jsonify({"data": types_list}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}, 500)