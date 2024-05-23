from flask import Blueprint, jsonify, request, send_file
from app.models import Route, Score
from app.database import db
from flask_jwt_extended import jwt_required
import csv
import io

route_bp = Blueprint('route_bp', __name__)

route_column_mapping = {
    "RouteId": "route_id",
    "StationCode": "station_code",
    "Date": "date",
    "DepartureTime": "departure_time",
    "ExecutorCapacity": "executor_capacity",
    "ScoreId": "score_id"
}

@route_bp.route('/routes', methods=['GET'])
def return_routes():
    try:
        route_id = request.args.get('id')
        scores = request.args.getlist('score')
        dict_scores = {
            "Alta": "High",
            "Media": "Medium",
            "Baja": "Low",
        }
        cities = request.args.getlist('city')
        city_station_code = {
            'Los Angeles': 'DLA',
            'Seattle': 'DSE',
            'Chicago': 'DCH',
            'Boston': 'DBO',
            'Austin': 'DAU'
        }
        stations = request.args.getlist('station')
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        start_time = request.args.get('startTime')
        end_time = request.args.get('endTime')
        low_capacity = request.args.get('lowCapacity')
        high_capacity = request.args.get('highCapacity')
        sort_key = request.args.get('sort')
        sort_direction = request.args.get('direction')
        limit = request.args.get('limit', type=int, default=20)
        page = request.args.get('page', type=int, default=1)

        query = Route.query

        if route_id:
            query = query.filter(Route.route_id == route_id)
        
        if scores:
            score_ids = []
            conditions = []
            parameterized_scores = [dict_scores[score] for score in scores if score != 'Sin datos']

            if parameterized_scores:
                score_records = Score.query.filter(Score.score_name.in_(parameterized_scores)).all()
                score_ids = [score.score_id for score in score_records]

            if 'Sin datos' in scores:
                conditions.append(Route.score_id == None)

            if score_ids:
                conditions.append(Route.score_id.in_(score_ids))

            if conditions:
                query = query.filter(db.or_(*conditions))

        if cities:
            city_codes = [Route.station_code.like(f"{city_station_code[city]}%") for city in cities]
            query = query.filter(db.or_(*city_codes))

        if stations:
            station_codes = [Route.station_code == station for station in stations]
            query = query.filter(db.or_(*station_codes))

        if start_date and end_date:
            query = query.filter(Route.date.between(start_date, end_date))
        elif start_date:
            query = query.filter(Route.date >= start_date)
        elif end_date:
            query = query.filter(Route.date <= end_date)

        if start_time and end_time:
            query = query.filter(Route.departure_time.between(start_time, end_time))
        elif start_time:
            query = query.filter(Route.departure_time >= start_time)
        elif end_time:
            query = query.filter(Route.departure_time <= end_time)

        if low_capacity and high_capacity:
            query = query.filter(Route.executor_capacity.between(low_capacity, high_capacity))
        elif low_capacity:
            query = query.filter(Route.executor_capacity >= low_capacity)
        elif high_capacity:
            query = query.filter(Route.executor_capacity <= high_capacity)

        total_count = query.count()
        total_pages = (total_count + limit - 1) // limit

        if sort_key and sort_direction:
            mapped_sort_key = route_column_mapping.get(sort_key)
            sort_column = getattr(Route, mapped_sort_key)
            if sort_direction == 'ASC':
                query = query.order_by(sort_column.asc())
            elif sort_direction == 'DESC':
                query = query.order_by(sort_column.desc())

        routes = query.paginate(page=page, per_page=limit, error_out=False).items

        routes_list = [{"RouteId": route.route_id, "StationCode": route.station_code, "Date": route.date.strftime('%Y-%m-%d'),
                        "DepartureTime": str(route.departure_time), "ExecutorCapacity": route.executor_capacity,
                        "ScoreId": route.score_id} for route in routes]

        return jsonify({'data': routes_list, 'totalPages': total_pages}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

@route_bp.route('/routes/station_codes', methods=['GET'])
def get_station_codes():
    try:
        station_codes = db.session.query(Route.station_code).distinct().order_by(Route.station_code).all()

        station_codes_list = [code[0] for code in station_codes]

        return jsonify({"data": station_codes_list}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500
    
@route_bp.route('/routes/download_csv', methods=['GET'])
@jwt_required()
def download_csv():
    try:
        query = Route.query
        route_id = request.args.get('id')
        scores = request.args.getlist('score')
        dict_scores = {
            "Alta": "High",
            "Media": "Medium",
            "Baja": "Low",
        }
        cities = request.args.getlist('city')
        city_station_code = {
            'Los Angeles': 'DLA',
            'Seattle': 'DSE',
            'Chicago': 'DCH',
            'Boston': 'DBO',
            'Austin': 'DAU'
        }
        stations = request.args.getlist('station')
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        start_time = request.args.get('startTime')
        end_time = request.args.get('endTime')
        low_capacity = request.args.get('lowCapacity')
        high_capacity = request.args.get('highCapacity')

        if route_id:
            query = query.filter(Route.route_id == route_id)
        
        if scores:
            score_ids = []
            conditions = []
            parameterized_scores = [dict_scores[score] for score in scores if score != 'Sin datos']

            if parameterized_scores:
                score_records = Score.query.filter(Score.score_name.in_(parameterized_scores)).all()
                score_ids = [score.score_id for score in score_records]

            if 'Sin datos' in scores:
                conditions.append(Route.score_id == None)

            if score_ids:
                conditions.append(Route.score_id.in_(score_ids))

            if conditions:
                query = query.filter(db.or_(*conditions))

        if cities:
            city_codes = [Route.station_code.like(f"{city_station_code[city]}%") for city in cities]
            query = query.filter(db.or_(*city_codes))

        if stations:
            station_codes = [Route.station_code == station for station in stations]
            query = query.filter(db.or_(*station_codes))

        if start_date and end_date:
            query = query.filter(Route.date.between(start_date, end_date))
        elif start_date:
            query = query.filter(Route.date >= start_date)
        elif end_date:
            query = query.filter(Route.date <= end_date)

        if start_time and end_time:
            query = query.filter(Route.departure_time.between(start_time, end_time))
        elif start_time:
            query = query.filter(Route.departure_time >= start_time)
        elif end_time:
            query = query.filter(Route.departure_time <= end_time)

        if low_capacity and high_capacity:
            query = query.filter(Route.executor_capacity.between(low_capacity, high_capacity))
        elif low_capacity:
            query = query.filter(Route.executor_capacity >= low_capacity)
        elif high_capacity:
            query = query.filter(Route.executor_capacity <= high_capacity)

        routes = query.all()

        score_dict = {score.score_id: score.score_name for score in Score.query.all()}
        score_dict[None] = 'Sin datos'
        score_translation = {
            'High': 'Alta',
            'Medium': 'Media',
            'Low': 'Baja'
        }

        output = io.StringIO()
        writer = csv.writer(output)
        
        writer.writerow(['Código de la ruta', 'Estación', 'Fecha', 'Hora', 'Capacidad', 'Puntuación'])
        

        for route in routes:
            score_name = score_dict.get(route.score_id, '-')
            translated_score_name = score_translation.get(score_name, score_name)   
            writer.writerow([
                route.route_id,
                route.station_code,
                route.date.strftime('%Y-%m-%d'),
                str(route.departure_time),
                route.executor_capacity,
                translated_score_name
            ])
        
        output.seek(0)
        
        return send_file(
            io.BytesIO(output.getvalue().encode()),
            mimetype='text/csv',
            as_attachment=True,
            download_name='routes.csv'
        )
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal Server Error"}), 500