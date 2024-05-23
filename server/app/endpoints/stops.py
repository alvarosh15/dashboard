from flask import Blueprint, jsonify, request, send_file
from app.models import Stop, Type
from flask_jwt_extended import jwt_required
import csv
import io

stop_bp = Blueprint('stop_bp', __name__)

stop_column_mapping = {
    "RouteId": "route_id",
    "StopId": "stop_id",
    "Latitude": "latitude",
    "Longitude": "longitude",
    "TypeId": "type_id",
    "ZoneId": "zone_id",
    "OrderPosition": "order_position",
    "TimeToNext": "time_to_next"
}

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
            query = query.filter(Stop.route_id == route_id)
        if stop_id:
            query = query.filter(Stop.stop_id == stop_id)
        if low_latitude and high_latitude:
            query = query.filter(Stop.latitude.between(low_latitude, high_latitude))
        if low_longitude and high_longitude:
            query = query.filter(Stop.longitude.between(low_longitude, high_longitude))
        if types:
            type_ids = [Type.query.filter(Type.type_name == dict_types[type_]).first().type_id for type_ in types]
            if type_ids:
                query = query.filter(Stop.type_id.in_(type_ids))
        if zone_id:
            query = query.filter(Stop.zone_id == zone_id)
        if position:
            query = query.filter(Stop.order_position == position)
        if low_time_to_next and high_time_to_next:
            query = query.filter(Stop.time_to_next.between(low_time_to_next, high_time_to_next))
        elif low_time_to_next:
            query = query.filter(Stop.time_to_next >= low_time_to_next)
        elif high_time_to_next:
            query = query.filter(Stop.time_to_next <= high_time_to_next)

        total_count = query.count()
        total_pages = (total_count + limit - 1) // limit

        if sort_key and sort_direction:
            mapped_sort_key = stop_column_mapping.get(sort_key)
            sort_column = getattr(Stop, mapped_sort_key)
            if sort_direction == 'ASC':
                query = query.order_by(sort_column.asc())
            elif sort_direction == 'DESC':
                query = query.order_by(sort_column.desc())

        stops = query.paginate(page=page, per_page=limit, error_out=False).items

        stops_list = [{"RouteId": stop.route_id, "StopId": stop.stop_id, "Latitude": stop.latitude, "Longitude": stop.longitude,
                       "TypeId": stop.type_id, "ZoneId": stop.zone_id, "OrderPosition": stop.order_position, "TimeToNext": stop.time_to_next} for stop in stops]

        return jsonify({"data": stops_list, "totalPages": total_pages}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

@stop_bp.route('/stops/download_csv', methods=['GET'])
@jwt_required()
def download_stops_csv():
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

        query = Stop.query

        if route_id:
            query = query.filter(Stop.route_id == route_id)
        if stop_id:
            query = query.filter(Stop.stop_id == stop_id)
        if low_latitude and high_latitude:
            query = query.filter(Stop.latitude.between(low_latitude, high_latitude))
        if low_longitude and high_longitude:
            query = query.filter(Stop.longitude.between(low_longitude, high_longitude))
        if types:
            type_ids = [Type.query.filter(Type.type_name == dict_types[type_]).first().type_id for type_ in types]
            if type_ids:
                query = query.filter(Stop.type_id.in_(type_ids))
        if zone_id:
            query = query.filter(Stop.zone_id == zone_id)
        if position:
            query = query.filter(Stop.order_position == position)
        if low_time_to_next and high_time_to_next:
            query = query.filter(Stop.time_to_next.between(low_time_to_next, high_time_to_next))
        elif low_time_to_next:
            query = query.filter(Stop.time_to_next >= low_time_to_next)
        elif high_time_to_next:
            query = query.filter(Stop.time_to_next <= high_time_to_next)

        stops = query.all()

        type_dict = {type_.type_id: type_.type_name for type_ in Type.query.all()}
        type_dict[None] = 'Sin datos'
        type_translation = {
            'Station': 'Almacen',
            'Dropoff': 'Entrega'
        }

        output = io.StringIO()
        writer = csv.writer(output)
        
        writer.writerow(['Código de la ruta', 'Latitud', 'Longitud', 'Posición', 'Código de la parada', 'Tiempo al siguiente', 'Tipo', 'Zona',])
        
        for stop in stops:
            type_name = type_dict.get(stop.type_id, '-')
            translated_type_name = type_translation.get(type_name, type_name)

            writer.writerow([
                stop.route_id,
                stop.latitude,
                stop.longitude,
                stop.order_position,
                stop.stop_id,
                stop.time_to_next,
                translated_type_name,
                stop.zone_id,
            ])

        
        output.seek(0)
        
        return send_file(
            io.BytesIO(output.getvalue().encode()),
            mimetype='text/csv',
            as_attachment=True,
            download_name='stops.csv'
        )
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal Server Error"}), 500