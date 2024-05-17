from flask import Blueprint, jsonify, request
from app.models.stop import Stop
from app.models.type import Type
from app.database import db

stop_bp = Blueprint('stop_bp', __name__)

@stop_bp.route('/stops', methods=['GET'])
def return_stops():
    try:
        route_id = request.args.get('routeId')
        stop_id = request.args.get('id')
        low_latitude = request.args.get('lowLatitude')
        high_latitude = request.args.get('highLatitude')
        low_longitude = request.args.get('lowLongitude')
        high_longitude = request.args.get('highLongitude')
        types = request.args.getlist('type')
        dict_types = {
            "Almacen": "Station",
            "Entrega": "Dropoff",
        }
        zone_id = request.args.get('zoneId')
        position = request.args.get('posicion')
        low_time_to_next = request.args.get('lowTimeToNext')
        high_time_to_next = request.args.get('highTimeToNext')

        sort_key = request.args.get('sort')
        sort_direction = request.args.get('direction')

        limit = request.args.get('limit', type=int, default=20)  
        page = request.args.get('page', type=int, default=1) 

        query = Stop.query

        if route_id:
            query = query.filter(Stop.RouteId == route_id)
        if stop_id:
            query = query.filter(Stop.StopId == stop_id)
        if low_latitude and high_latitude:
            query = query.filter(Stop.Latitude.between(low_latitude, high_latitude))
        if low_longitude and high_longitude:
            query = query.filter(Stop.Longitude.between(low_longitude, high_longitude))
        if types:
            type_ids = [Type.query.filter(Type.TypeName == dict_types[type_]).first().TypeId for type_ in types]
            if type_ids:
                query = query.filter(Stop.TypeId.in_(type_ids))
        if zone_id:
            query = query.filter(Stop.ZoneId == zone_id)
        if position:
            query = query.filter(Stop.OrderPosition == position)
        if low_time_to_next and high_time_to_next:
            query = query.filter(Stop.TimeToNext.between(low_time_to_next, high_time_to_next))
        elif low_time_to_next:
            query = query.filter(Stop.TimeToNext >= low_time_to_next)
        elif high_time_to_next:
            query = query.filter(Stop.TimeToNext <= high_time_to_next)

        total_count = query.count()
        total_pages = (total_count + limit - 1) // limit

        if sort_key and sort_direction:
            sort_column = getattr(Stop, sort_key)
            if sort_direction == 'asc':
                query = query.order_by(sort_column.asc())
            elif sort_direction == 'desc':
                query = query.order_by(sort_column.desc())

        stops = query.paginate(page=page, per_page=limit, error_out=False).items

        stops_list = [{"RouteId": stop.RouteId, "StopId": stop.StopId, "Latitude": stop.Latitude, "Longitude": stop.Longitude,
                       "TypeId": stop.TypeId, "ZoneId": stop.ZoneId, "OrderPosition": stop.OrderPosition, "TimeToNext": stop.TimeToNext} for stop in stops]

        return jsonify({"data": stops_list, "totalPages": total_pages}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500
