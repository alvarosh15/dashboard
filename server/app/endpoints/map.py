from flask import Blueprint, jsonify, request
from app.models.stop import Stop


map_bp = Blueprint('map_bp', __name__)

@map_bp.route('/route/stops/coordinates', methods=['GET'])
def get_stops_coordinates():
    try:
        route_id = request.args.get('id')
        if not route_id:
            return jsonify({"error": "Route ID is required"}), 400

        stops = Stop.query.filter_by(RouteId=route_id).all()
        coordinates = {
            "lat": [stop.Latitude for stop in stops],
            "lon": [stop.Longitude for stop in stops]
        }
        return jsonify({"data": coordinates}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500