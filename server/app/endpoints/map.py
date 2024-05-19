from flask import Blueprint, jsonify, request
from app.models import Stop
from app.models import Type



map_bp = Blueprint('map_bp', __name__)

@map_bp.route('/route/stops/coordinates', methods=['GET'])
def get_stops_coordinates():
    try:
        route_id = request.args.get('id')
        if not route_id:
            return jsonify({"error": "Route ID is required"}), 400

        stops = Stop.query.filter_by(RouteId=route_id).all()

        type_ids = [stop.TypeId for stop in stops]

        types = Type.query.filter(Type.TypeId.in_(type_ids)).all()
        type_dict = {type.TypeId: type.TypeName for type in types}

        coordinates = {
            "lat": [stop.Latitude for stop in stops],
            "lon": [stop.Longitude for stop in stops],
            "type": [type_dict.get(stop.TypeId) for stop in stops]
        }
        return jsonify({"data": coordinates}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500