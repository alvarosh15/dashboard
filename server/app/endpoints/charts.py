from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from sqlalchemy import asc, func
from sqlalchemy.orm import aliased
from app.models import Route, Package, Status, Score, Liked, Chart, ChartType
from app.database import db

charts_bp = Blueprint('charts_bp', __name__)

@charts_bp.route('/charts/general', methods=['GET'])
def get_general_charts():
    try:
        type_ids = ChartType.query.filter(ChartType.type.in_(['General', 'City'])).all()
        type_ids = [type_.id for type_ in type_ids]

        charts = Chart.query.filter(Chart.type_id.in_(type_ids)).order_by(asc(Chart.position)).all()

        items = [{"Id": chart.id, "Config": chart.config} for chart in charts]
        return jsonify({'data': items}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/charts/city', methods=['GET'])
def get_city_charts():
    try:

        CityId = ChartType.query.filter(ChartType.type == 'City').first().id
        charts = Chart.query.filter(Chart.type_id == CityId).order_by(asc(Chart.position)).all()

        items = [{"Id": chart.id, "Config": chart.config} for chart in charts]
        return jsonify({'data': items}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/liked_charts', methods=['GET'])
@jwt_required()
def get_liked_charts():
    try:
        user_id = get_jwt_identity()['id']
        
        liked_charts = Liked.query.filter_by(user_id=user_id).order_by(Liked.id.desc()).all()
        data = []
        for liked in liked_charts:
                config_with_city = dict(liked.chart.config)  
                config_with_city['city'] = liked.city
                data.append({"config": config_with_city,
                    "id": liked.chart_id  
                })

        return jsonify({'data': data}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/liked_charts', methods=['POST'])
@jwt_required()
def post_liked_chart():
    try:
        user_id = get_jwt_identity()['id']
        data = request.get_json()

        chart_id = data.get('chartId')
        city = data.get('city', '') 

        if Liked.query.filter_by(user_id=user_id, chart_id=chart_id).first():
            return jsonify({"message": "You already liked this chart"}), 409

        new_like = Liked(
            user_id=user_id,
            chart_id=chart_id,
            city=city
        )
        
        db.session.add(new_like)
        db.session.commit()

        return jsonify({"message": "Liked chart saved successfully"}), 201
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/liked_charts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_history(id):
    try:
        user_id = get_jwt_identity().get('id')
        
        liked_item = Liked.query.filter_by(chart_id=id).first()

        if not liked_item or liked_item.user_id != user_id:
            return jsonify({"message": "Item not found or access denied"}), 404

        db.session.delete(liked_item)
        db.session.commit()
        
        return jsonify({"message": "Item deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/liked_charts/ids', methods=['GET'])
@jwt_required()
def get_liked_charts_id():
    try:
        user_id = get_jwt_identity()['id']
        liked_charts = Liked.query.filter_by(user_id=user_id).all()
        data = [liked.chart_id for liked in liked_charts]
        return jsonify({'data': data}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/routes_by_capacity', methods=['GET'])
def routes_by_capacity():
    try:
        city = request.args.get('city')
        city_station_code = {
            'Los Angeles': 'DLA',
            'Seattle': 'DSE',
            'Chicago': 'DCH',
            'Boston': 'DBO',
            'Austin': 'DAU'
        }

        query = db.session.query(Route.executor_capacity, db.func.count(Route.executor_capacity)).group_by(Route.executor_capacity).order_by(Route.executor_capacity)

        if city:
            query = query.filter(Route.station_code.like(f"{city_station_code[city]}%"))

        results = query.all()

        routes_by_capacity = {row[0]: row[1] for row in results}
        return jsonify({"data": routes_by_capacity}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/packages_by_status', methods=['GET'])
def packages_by_status():
    try:
        city = request.args.get('city')
        city_station_code = {
            'Los Angeles': 'DLA',
            'Seattle': 'DSE',
            'Chicago': 'DCH',
            'Boston': 'DBO',
            'Austin': 'DAU'
        }

        query = db.session.query(
            Status.status_name.label('StatusName'), 
            func.count().label('Count')
        ).select_from(Package).outerjoin(
            Status, Package.status_id == Status.status_id 
        ).group_by(
            Status.status_name
        )

        if city:
            query = query.join(Route, Package.route_id == Route.route_id).filter(Route.station_code.like(f"{city_station_code[city]}%"))

        results = query.all()
        print(results)

        package_by_status = {row.StatusName if row.StatusName else 'Sin datos': row.Count for row in results}

        return jsonify({"data": package_by_status}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal Server Error"}), 500
    
@charts_bp.route('/routes_by_month', methods=['GET'])
def routes_by_month():
    try:
        city = request.args.get('city')
        city_station_code = {
            'Los Angeles': 'DLA',
            'Seattle': 'DSE',
            'Chicago': 'DCH',
            'Boston': 'DBO',
            'Austin': 'DAU'
        }

        query = db.session.query(db.func.date_format(Route.date, '%Y-%m').label('Month'), db.func.count(Route.route_id)).group_by('Month').order_by('Month')

        if city:
            query = query.filter(Route.station_code.like(f"{city_station_code[city]}%"))

        results = query.all()

        routes_by_month = {row[0]: row[1] for row in results}
        return jsonify({"data": routes_by_month}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/routes_by_day', methods=['GET'])
def routes_by_day():
    try:
        city = request.args.get('city')
        city_station_code = {
            'Los Angeles': 'DLA',
            'Seattle': 'DSE',
            'Chicago': 'DCH',
            'Boston': 'DBO',
            'Austin': 'DAU'
        }

        query = db.session.query(Route.date, db.func.count(Route.route_id)).group_by(Route.date).order_by(Route.date)

        if city:
            query = query.filter(Route.station_code.like(f"{city_station_code[city]}%"))

        results = query.all()

        routes_by_day = {row[0].strftime("%Y-%m-%d"): row[1] for row in results}
        return jsonify({"data": routes_by_day}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/score_counts', methods=['GET'])
def score_counts():
    try:
        city = request.args.get('city')
        city_station_code = {
            'Los Angeles': 'DLA',
            'Seattle': 'DSE',
            'Chicago': 'DCH',
            'Boston': 'DBO',
            'Austin': 'DAU'
        }

        query = db.session.query(
            Score.score_name.label('ScoreName'),
            func.count().label('Count')
        ).select_from(Route).outerjoin(Score, Route.score_id == Score.score_id).group_by(
            Score.score_name
        )
        
        if city:
            query = query.filter(Route.station_code.like(f"{city_station_code[city]}%"))

        results = query.all()

        score_counts = {row.ScoreName if row.ScoreName else 'Sin datos': row.Count for row in results}
        return jsonify({"data": score_counts}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/routes_by_city', methods=['GET'])
def routes_by_city():
    try:
        query = db.session.query(
            db.case(
                (Route.station_code.like('DAU%'), 'Austin'),
                (Route.station_code.like('DBO%'), 'Boston'),
                (Route.station_code.like('DLA%'), 'Los Angeles'),
                (Route.station_code.like('DCH%'), 'Chicago'),
                (Route.station_code.like('DSE%'), 'Seattle'),
                else_='Unknown'
            ).label('City'),
            db.func.count(Route.route_id).label('NumberOfRoutes')
        ).group_by('City')

        results = query.all()

        routes_by_city = {row[0]: row[1] for row in results}

        return jsonify({"data": routes_by_city}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/routes_by_departure_hour', methods=['GET'])
def routes_by_departure_hour():
    try:
        city = request.args.get('city')
        city_station_code = {
            'Los Angeles': 'DLA',
            'Seattle': 'DSE',
            'Chicago': 'DCH',
            'Boston': 'DBO',
            'Austin': 'DAU'
        }

        query = db.session.query(
            db.func.hour(Route.departure_time).label('Hour'),
            db.func.count(Route.route_id).label('Load')
        ).group_by('Hour').order_by('Hour')

        if city:
            query = query.filter(Route.station_code.like(f"{city_station_code[city]}%"))

        results = query.all()

        loads_by_hour = {row[0]: row[1] for row in results}
        return jsonify({"data": loads_by_hour}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/avg_packages', methods=['GET']) 
def avg_packages(): 
    try:
        city = request.args.get('city')
        city_station_code = {
            'Austin': 'DAU%',
            'Boston': 'DBO%',
            'Los Angeles': 'DLA%',
            'Chicago': 'DCH%',
            'Seattle': 'DSE%'
        }

        subquery = db.session.query(
            Package.route_id,
            func.count(Package.package_id).label('package_count')
        ).group_by(Package.route_id).subquery()

        alias_subquery = aliased(subquery)

        if city and city in city_station_code:
            base_query = db.session.query(
                func.avg(alias_subquery.c.package_count).label('AvgPackagesPerRoute')
            ).select_from(Route).join(
                alias_subquery, alias_subquery.c.route_id == Route.route_id
            ).filter(Route.station_code.like(city_station_code[city]))
        else:
            base_query = db.session.query(
                func.avg(alias_subquery.c.package_count).label('AvgPackagesPerRoute')
            ).select_from(Route).join(
                alias_subquery, alias_subquery.c.route_id == Route.route_id
            )

        result = base_query.scalar()

        if city and city in city_station_code:
            response = {city: result}
        else:
            response = {"Todas las ciudades": result}

        return jsonify({"data": response}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500