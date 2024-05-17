from flask import Blueprint, jsonify, request
from app.models.route import Route
from app.models.score import Score
from app.database import db

route_bp = Blueprint('route_bp', __name__)

@route_bp.route('/routes', methods=['GET'])
def return_route():
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
            query = query.filter(Route.RouteId == route_id)
        
        if scores:
            score_ids = []
            conditions = []
            parameterized_scores = [dict_scores[score] for score in scores if score != 'Sin datos']

            if parameterized_scores:
                score_records = Score.query.filter(Score.ScoreName.in_(parameterized_scores)).all()
                score_ids = [score.ScoreId for score in score_records]

            if 'Sin datos' in scores:
                conditions.append(Route.ScoreId == None)

            if score_ids:
                conditions.append(Route.ScoreId.in_(score_ids))

            if conditions:
                query = query.filter(db.or_(*conditions))

        if cities:
            city_codes = [Route.StationCode.like(f"{city_station_code[city]}%") for city in cities]
            query = query.filter(db.or_(*city_codes))

        if stations:
            station_codes = [Route.StationCode == station for station in stations]
            query = query.filter(db.or_(*station_codes))

        if start_date and end_date:
            query = query.filter(Route.Date.between(start_date, end_date))
        elif start_date:
            query = query.filter(Route.Date >= start_date)
        elif end_date:
            query = query.filter(Route.Date <= end_date)

        if start_time and end_time:
            query = query.filter(Route.DepartureTime.between(start_time, end_time))
        elif start_time:
            query = query.filter(Route.DepartureTime >= start_time)
        elif end_time:
            query = query.filter(Route.DepartureTime <= end_time)

        if low_capacity and high_capacity:
            query = query.filter(Route.ExecutorCapacity.between(low_capacity, high_capacity))
        elif low_capacity:
            query = query.filter(Route.ExecutorCapacity >= low_capacity)
        elif high_capacity:
            query = query.filter(Route.ExecutorCapacity <= high_capacity)

        total_count = query.count()
        total_pages = (total_count + limit - 1) // limit

        if sort_key and sort_direction:
            sort_column = getattr(Route, sort_key)
            if sort_direction == 'ASC':
                query = query.order_by(sort_column.asc())
            elif sort_direction == 'DESC':
                query = query.order_by(sort_column.desc())

        routes = query.paginate(page=page, per_page=limit, error_out=False).items

        routes_list = [{"RouteId": route.RouteId, "StationCode": route.StationCode, "Date": route.Date.strftime('%Y-%m-%d'),
                        "DepartureTime": str(route.DepartureTime), "ExecutorCapacity": route.ExecutorCapacity,
                        "ScoreId": route.ScoreId} for route in routes]

        return jsonify({'data': routes_list, 'totalPages': total_pages}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

@route_bp.route('/routes/station_codes', methods=['GET'])
def get_station_codes():
    try:
        station_codes = db.session.query(Route.StationCode).distinct().order_by(Route.StationCode).all()

        station_codes_list = [code[0] for code in station_codes]

        return jsonify({"data": station_codes_list}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500