from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from sqlalchemy import desc, asc, func
from sqlalchemy.orm import aliased
from app.models import Route, Package, Status, Score, Liked, Chart, ChartType, AvgPackagesPerCity
from app.database import db

charts_bp = Blueprint('charts_bp', __name__)

@charts_bp.route('/charts/general', methods=['GET'])
def get_general_charts():
    try:
        general_type_id = ChartType.query.filter_by(type='General').first().id
        city_type_id = ChartType.query.filter_by(type='City').first().id

        general_charts = Chart.query.filter_by(type_id=general_type_id).order_by(asc(Chart.position)).all()
        city_charts = Chart.query.filter_by(type_id=city_type_id).order_by(asc(Chart.position)).all()

        charts = general_charts + city_charts

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
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/liked_charts', methods=['POST'])
@jwt_required()
def post_liked_chart():
    try:
        user_id = get_jwt_identity()['id']
        data = request.get_json()

        chart_id = data.get('chartId')
        city = data.get('city', '') 

        if Liked.query.filter_by(user_id=user_id, chart_id=chart_id, city=city).first():
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
        print(e)
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/liked_charts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_liked_chart(id):
    try:
        user_id = get_jwt_identity().get('id')
        data = request.get_json()
        city = data.get('city')

        liked_item = Liked.query.filter_by(chart_id=id, user_id=user_id, city=city).first()

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
        data = [f"{liked.chart_id}_{liked.city}" for liked in liked_charts]
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

        package_by_status = {row.StatusName if row.StatusName else 'Sin datos': row.Count for row in results}

        return jsonify({"data": package_by_status}), 200
    except Exception as e:
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
    def format_decimal(value):
            return f"{value:.2f}"
    try:        
        city = request.args.get('city')
        city_station_code = {
            'Austin': 'DAU%',
            'Boston': 'DBO%',
            'Los Angeles': 'DLA%',
            'Chicago': 'DCH%',
            'Seattle': 'DSE%'
        }

        if city and city in city_station_code:
            result = db.session.query(
                AvgPackagesPerCity.avg_packages_per_route
            ).filter(AvgPackagesPerCity.city == city).scalar()
            
            response = {city: format_decimal(result)}
        else:
            overall_avg = db.session.query(
                AvgPackagesPerCity.avg_packages_per_route
            ).filter(AvgPackagesPerCity.city == "General").scalar()
            
            response = {"Todas las ciudades": format_decimal(overall_avg)}
        
        return jsonify({"data": response}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500
    
@charts_bp.route('/busiest_day', methods=['GET']) 
def busiest_day(): 
    try:        
        city = request.args.get('city')
        city_station_code = {
            'Austin': 'DAU%',
            'Boston': 'DBO%',
            'Los Angeles': 'DLA%',
            'Chicago': 'DCH%',
            'Seattle': 'DSE%'
        }

        if city and city in city_station_code:
            result = db.session.query(
                Route.date.label('Date'),
                func.count(Route.route_id).label('NumberOfRoutes')
            ).filter(Route.station_code.like(city_station_code[city])).group_by(Route.date).order_by(func.count(Route.route_id).desc()).limit(1).first()
            
            response = {
                "Ciudad": city,
                "Fecha": result.Date.strftime("%Y-%m-%d") if result else None,
                "Número de rutas": result.NumberOfRoutes if result else 0
            }
        else:
            result = db.session.query(
                Route.date.label('Date'),
                func.count(Route.route_id).label('NumberOfRoutes')
            ).group_by(Route.date).order_by(func.count(Route.route_id).desc()).limit(1).first()
            
            response = {
                "Ciudad": "Todas las ciudades",
                "Fecha": result.Date.strftime("%Y-%m-%d") if result else None,
                "Número de rutas": result.NumberOfRoutes if result else 0
            }
        
        return jsonify({"data": response}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500
