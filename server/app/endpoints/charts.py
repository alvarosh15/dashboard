from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from sqlalchemy import desc, func, case
from sqlalchemy.orm import aliased
from app.models import Route
from app.models import Package
from app.models import Status
from app.models import Score
from app.models import Liked
from app.database import db

charts_bp = Blueprint('charts_bp', __name__)

@charts_bp.route('/liked_charts', methods=['GET'])
@jwt_required()
def get_liked_charts():
    try:
        user_id = get_jwt_identity()['id']
        
        liked_charts = Liked.query.filter_by(UserId=user_id).order_by(Liked.Id.desc()).all()
        
        configs = []
        for chart in liked_charts:
            config = {
                'size': chart.Size,
                'type': chart.Type,
                'title': chart.Title,
                'city': chart.City,
                'colorPalette': chart.ColorPalette.get('Colors', []) if chart.ColorPalette else [],
                'dataConfig': chart.DataConfig,
                'layoutConfig': chart.LayoutConfig,
                'dataFetcher': chart.DataFetcher
            }
            configs.append(config)

        return jsonify({'data': configs}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal Server Error"}), 500

@charts_bp.route('/liked_charts', methods=['POST'])
@jwt_required()
def post_liked_chart():
    try:
        user_id = get_jwt_identity()['id']
        data = request.json

        color_palette = data.get('colorPalette')
        if isinstance(color_palette, str):
            color_palette = {"Colors": [color_palette]}
        elif isinstance(color_palette, list):
            color_palette = {"Colors": color_palette}

        new_liked = Liked(
            UserId=user_id,
            Size=data.get('size'),
            Type=data.get('type'),
            Title=data.get('title', 'Sin titulo'),
            City=data.get('city'),
            ColorPalette=color_palette,
            DataConfig=data.get('dataConfig', {}),
            LayoutConfig=data.get('layoutConfig', {}),
            DataFetcher=data.get('dataFetcher')
        )
        print(data.get('city'))
        db.session.add(new_liked)
        db.session.commit()

        return jsonify({"message": "Liked chart saved successfully"}), 201
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

        query = db.session.query(Route.ExecutorCapacity, db.func.count(Route.ExecutorCapacity)).group_by(Route.ExecutorCapacity).order_by(Route.ExecutorCapacity)

        if city:
            query = query.filter(Route.StationCode.like(f"{city_station_code[city]}%"))

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
            Status.StatusName.label('StatusName'), 
            func.count().label('Count')
        ).select_from(Package).outerjoin(
            Status, Package.StatusId == Status.StatusId 
        ).group_by(
            Status.StatusName
        )

        if city:
            query = query.join(Route, Package.RouteId == Route.RouteId).filter(Route.StationCode.like(f"{city_station_code[city]}%"))

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

        query = db.session.query(db.func.date_format(Route.Date, '%Y-%m').label('Month'), db.func.count(Route.RouteId)).group_by('Month').order_by('Month')

        if city:
            query = query.filter(Route.StationCode.like(f"{city_station_code[city]}%"))

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

        query = db.session.query(Route.Date, db.func.count(Route.RouteId)).group_by(Route.Date).order_by(Route.Date)

        if city:
            query = query.filter(Route.StationCode.like(f"{city_station_code[city]}%"))

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
            Score.ScoreName.label('ScoreName'),
            func.count().label('Count')
        ).select_from(Route).outerjoin(Score, Route.ScoreId == Score.ScoreId).group_by(
            Score.ScoreName
        )
        
        if city:
            query = query.filter(Route.StationCode.like(f"{city_station_code[city]}%"))

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
                (Route.StationCode.like('DAU%'), 'Austin'),
                (Route.StationCode.like('DBO%'), 'Boston'),
                (Route.StationCode.like('DLA%'), 'Los Angeles'),
                (Route.StationCode.like('DCH%'), 'Chicago'),
                (Route.StationCode.like('DSE%'), 'Seattle'),
                else_='Unknown'
            ).label('City'),
            db.func.count(Route.RouteId).label('NumberOfRoutes')
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
            db.func.hour(Route.DepartureTime).label('Hour'),
            db.func.count(Route.RouteId).label('Load')
        ).group_by('Hour').order_by('Hour')

        if city:
            query = query.filter(Route.StationCode.like(f"{city_station_code[city]}%"))

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
            Package.RouteId,
            func.count(Package.PackageId).label('package_count')
        ).group_by(Package.RouteId).subquery()

        alias_subquery = aliased(subquery)

        if city and city in city_station_code:
            base_query = db.session.query(
                func.avg(alias_subquery.c.package_count).label('AvgPackagesPerRoute')
            ).select_from(Route).join(
                alias_subquery, alias_subquery.c.RouteId == Route.RouteId
            ).filter(Route.StationCode.like(city_station_code[city]))
        else:
            base_query = db.session.query(
                func.avg(alias_subquery.c.package_count).label('AvgPackagesPerRoute')
            ).select_from(Route).join(
                alias_subquery, alias_subquery.c.RouteId == Route.RouteId
            )

        result = base_query.scalar()

        if city and city in city_station_code:
            response = {city: result}
        else:
            response = {"Todas las ciudades": result}

        return jsonify({"data": response}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500