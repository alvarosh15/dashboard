from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from datetime import date, timedelta, datetime

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = mysql.connector.connect(
        host='localhost',
        user='alvaro',
        password='123456789',
        database='dashboard'
    )
    return conn

@app.route("/api/routes_by_capacity", methods=['GET'])
def routes_by_capacity():
    city = request.args.get('city')
    conn = get_db_connection()
    cursor = conn.cursor()

    # Construimos la consulta base
    query = """
    SELECT ExecutorCapacity, COUNT(*) AS RouteCount
        FROM Route
    """

    city_station_code = {
        'Los Angeles': 'DLA',
        'Seattle': 'DSE',
        'Chicago': 'DCH',
        'Boston': 'DBO',
        'Austin': 'DAU'
    }

    # Añadimos filtro por ciudad si existe
    if city:
        query += f" WHERE StationCode LIKE '{city_station_code[city]}%' "

    query += " GROUP BY ExecutorCapacity ORDER BY ExecutorCapacity;"

    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    # Preparamos los datos para la respuesta
    routes_by_capacity = {row[0]: row[1] for row in results}
    return jsonify(routes_by_capacity)

@app.route("/api/packages_by_status", methods=['GET'])
def packages_by_status():
    city = request.args.get('city')
    conn = get_db_connection()
    cursor = conn.cursor()

    # Construimos la consulta base
    query = """
        SELECT COALESCE(Status.StatusName, 'Sin datos') AS StatusName, COUNT(*) AS Count
        FROM Package
        LEFT JOIN Status ON Package.StatusId = Status.StatusId
    """

    city_station_code = {
        'Los Angeles': 'DLA',
        'Seattle': 'DSE',
        'Chicago': 'DCH',
        'Boston': 'DBO',
        'Austin': 'DAU'
    }

    # Añadimos filtro por ciudad si se proporciona
    if city:
        query += f" JOIN Route ON Package.RouteId = Route.RouteId WHERE Route.StationCode LIKE '{city_station_code[city]}%' "

    query += "GROUP BY Status.StatusName;"

    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    # Preparar los datos para la respuesta
    package_by_status = {row[0]: row[1] for row in results}
    return jsonify(package_by_status)

@app.route("/api/stops/coordinates", methods=['GET'])
def get_stops_coordinates():
    route_id = request.args.get('id')
    if not route_id:
        return jsonify({"error": "Route ID is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
    SELECT Latitude, Longitude
    FROM Stop
    WHERE RouteId = %s;
    """
    cursor.execute(query, (route_id,))
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    lat = [result[0] for result in results]
    lon = [result[1] for result in results]

    coordinates = {"lat": lat, "lon": lon}
    return jsonify(coordinates)

@app.route("/api/routes_by_month", methods=['GET'])
def routes_by_month():
    city = request.args.get('city')
    conn = get_db_connection()
    cursor = conn.cursor()

    # Construimos la consulta base
    query = """
    SELECT DATE_FORMAT(Date, '%Y-%m') AS Month, COUNT(*) AS RouteCount
    FROM Route  
    """

    city_station_code = {
        'Los Angeles': 'DLA',
        'Seattle': 'DSE',
        'Chicago': 'DCH',
        'Boston': 'DBO',
        'Austin': 'DAU'
    }

    # Añadimos filtro por ciudad si existe
    if city:
        query += f" WHERE Route.StationCode LIKE '{city_station_code[city]}%' "

    query += "GROUP BY Month ORDER BY Month;"

    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    # Preparamos los datos para la respuesta
    routes_by_day = {row[0]: row[1] for row in results}
    return jsonify(routes_by_day)

@app.route("/api/routes_by_day", methods=['GET'])
def routes_by_day():
    city = request.args.get('city')
    conn = get_db_connection()
    cursor = conn.cursor()

    # Construimos la consulta base
    query = """
    SELECT Date, COUNT(*) AS RouteCount
    FROM Route  
    """

    city_station_code = {
        'Los Angeles': 'DLA',
        'Seattle': 'DSE',
        'Chicago': 'DCH',
        'Boston': 'DBO',
        'Austin': 'DAU'
    }

    # Añadimos filtro por ciudad si existe
    if city:
        query += f" WHERE Route.StationCode LIKE '{city_station_code[city]}%' "

    query += "GROUP BY Date ORDER BY Date;"

    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    # Preparamos los datos para la respuesta
    routes_by_day = {row[0].strftime("%Y-%m-%d"): row[1] for row in results}
    return jsonify(routes_by_day)

@app.route("/api/score_counts", methods=['GET'])
def score_counts():
    city = request.args.get('city')
    conn = get_db_connection()
    cursor = conn.cursor()

    # Construimos la consulta base
    query = """
    SELECT COALESCE(Score.ScoreName, 'Sin datos') AS ScoreName, COUNT(*) AS Count
    FROM Route
    LEFT JOIN Score ON Route.ScoreId = Score.ScoreId
    """

    city_station_code = {
        'Los Angeles': 'DLA',
        'Seattle': 'DSE',
        'Chicago': 'DCH',
        'Boston': 'DBO',
        'Austin': 'DAU'
    }

    # Añadimos filtro por ciudad si se proporciona
    if city:
        query += f" WHERE Route.StationCode LIKE '{city_station_code[city]}%' "

    query += "GROUP BY Score.ScoreName"

    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    # Preparar los datos para la respuesta
    score_counts = {row[0]: row[1] for row in results}
    return jsonify(score_counts)

@app.route("/api/scores", methods=['GET'])
def return_scores():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Score")
    scores = cursor.fetchall()
    cursor.close()
    conn.close()

    columns = [desc[0] for desc in cursor.description]
    scores_list = []

    for score in scores:
        score_dict = dict(zip(columns, score))
        scores_list.append(score_dict)

    return jsonify(scores_list)

@app.route("/api/types", methods=['GET'])
def return_types():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Type")
    types = cursor.fetchall()
    cursor.close()
    conn.close()

    columns = [desc[0] for desc in cursor.description]
    types_list = []

    for type in types:
        type_dict = dict(zip(columns, type))
        types_list.append(type_dict)

    return jsonify(types_list)

@app.route("/api/status", methods=['GET'])
def return_status():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Status")
    status = cursor.fetchall()
    cursor.close()
    conn.close()

    columns = [desc[0] for desc in cursor.description]
    status_list = []

    for state in status:
        state_dict = dict(zip(columns, state))
        status_list.append(state_dict)

    return jsonify(status_list)

@app.route("/api/stops", methods=['GET'])
def return_stops():
    conn = get_db_connection()
    cursor = conn.cursor()

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

    # Obtenemos los parametros de ordenación
    sort_key = request.args.get('sort')
    sort_direction = request.args.get('direction')

    # Obtenemos los parametros de paginacion
    limit = request.args.get('limit', type=int, default=20)  
    page = request.args.get('page', type=int, default=1) 

    query = " FROM Stop WHERE 1=1"

    if route_id:
        query += f" AND RouteId = '{route_id}'"
    if stop_id:
        query += f" AND StopId = '{stop_id}'"
    if low_latitude and high_latitude:
        query += f" AND Latitude BETWEEN {low_latitude} AND {high_latitude}"
    if low_longitude and high_longitude:
        query += f" AND Longitude BETWEEN {low_longitude} AND {high_longitude}"
    if types:
        type_ids = []
        for type in types:
            cursor.execute(f"SELECT TypeId FROM Type WHERE TypeName = '{dict_types[type]}'")
            result = cursor.fetchone()
            if result:
                type_ids.append(result[0])
        if type_ids:
            type_ids_str = ','.join(map(str, type_ids))
            query += f" AND TypeId IN ({type_ids_str})"

    if zone_id:
        query += f" AND ZoneId = '{zone_id}'"
    if position:
        query += f" AND OrderPosition = {position}"
    if low_time_to_next and high_time_to_next:
        query += f" AND TimeToNext BETWEEN {low_time_to_next} AND {high_time_to_next}"
    elif low_time_to_next:
        query += f" AND TimeToNext >= {low_time_to_next}"
    elif high_time_to_next:
        query += f" AND TimeToNext <= {high_time_to_next}"

    # Ejecutamos la consulta para obtener el número total de páginas
    count_query = f"SELECT COUNT(*) {query}"
    cursor.execute(count_query)
    total_count = cursor.fetchone()[0]
    total_pages = (total_count + limit - 1) // limit 

    # Añadimos los parametros de ordenación
    if sort_key and sort_direction:
        query += f" ORDER BY {sort_key} {sort_direction}"

    # Añadimos los parametros de paginacion
    if limit:
        query += f" LIMIT {limit}"
    if page:
        offset = (page - 1) * limit
        query += f" OFFSET {offset}"

    # Ejectuamos la consulta para obtener todos los datos
    data_query = f"SELECT * {query}"
    cursor.execute(data_query)
    stops = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]

    stops_list = [dict(zip(columns, stop)) for stop in stops]

    cursor.close()
    conn.close()

    return jsonify({"data": stops_list, "totalPages": total_pages})

@app.route("/api/routes/station_codes", methods=['GET'])
def get_station_codes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT StationCode FROM Route ORDER BY StationCode;")
    station_codes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify([code[0] for code in station_codes])

@app.route("/api/routes", methods=['GET'])
def return_route():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Obtenemos los filtros de la petición
    id = request.args.get('id')
    scores = request.args.getlist('score')
    dict_scores = {
        "Alta": "High",
        "Media": "Medium",
        "Baja": "Low",
    }
    cities = request.args.getlist('city')
    # Creamos un diccionario para mapear las ciudades con sus códigos de estación
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

    # Obtenemos los parametros de ordenación
    sort_key = request.args.get('sort')
    sort_direction = request.args.get('direction')

    # Obtenemos los parametros de paginacion
    limit = request.args.get('limit', type=int, default=20)  
    page = request.args.get('page', type=int, default=1) 

    # Construimos la petición 
    query = f" FROM Route WHERE 1=1"

    # Añadimos los filtros a la petición
    if id:
        query += f" AND RouteId='{id}'"
    
    if scores:
        score_ids = []
        conditions = []
        parameterized_scores = [dict_scores[score] for score in scores if score != 'Sin datos']

        if parameterized_scores:
            placeholders = ', '.join(['%s'] * len(parameterized_scores))
            cursor.execute(f"SELECT ScoreId FROM Score WHERE ScoreName IN ({placeholders})", parameterized_scores)
            score_ids = [result[0] for result in cursor.fetchall()]

        if 'Sin datos' in scores:
            conditions.append("ScoreId IS NULL")

        if score_ids:
            conditions.append(f"ScoreId IN ({', '.join(map(str, score_ids))})")

        if conditions:
            query += f" AND ({' OR '.join(conditions)})"

    if cities:
        city_codes = [f"StationCode LIKE '{city_station_code[city]}%'" for city in cities]
        city_codes_str = ' OR '.join(city_codes)
        query += f" AND ({city_codes_str})"

    if stations:
        station_codes = [f"StationCode = '{station}'" for station in stations]
        station_codes_str = ' OR '.join(station_codes)
        query += f" AND ({station_codes_str})"

    if start_date and end_date: 
        query += f" AND Date BETWEEN '{start_date}' AND '{end_date}'"
    elif start_date:
        query += f" AND Date >= '{start_date}'"
    elif end_date:
        query += f" AND Date <= '{end_date}'"

    if start_time and end_time:
        query += f" AND DepartureTime BETWEEN '{start_time}' AND '{end_time}'"
    elif start_time:
        query += f" AND DepartureTime >= '{start_time}'"
    elif end_time:
        query += f" AND DepartureTime <= '{end_time}'"

    if low_capacity and high_capacity:
        query += f" AND ExecutorCapacity BETWEEN {low_capacity} AND {high_capacity}"
    elif low_capacity:
        query += f" AND ExecutorCapacity >= {low_capacity}"
    elif high_capacity:
        query += f" AND ExecutorCapacity <= {high_capacity}"

    # Ejecutamos la consulta para obtener el número total de páginas
    count_query = f"SELECT COUNT(*) {query}"
    cursor.execute(count_query)
    total_count = cursor.fetchone()[0]
    total_pages = (total_count + limit - 1) // limit 

    # Añadimos los parametros de ordenación
    if sort_key and sort_direction:
        query += f" ORDER BY {sort_key} {sort_direction}"

    # Añadimos los parametros de paginacion
    if limit:
        query += f" LIMIT {limit}"
    if page:
        offset = (page - 1) * limit
        query += f" OFFSET {offset}"

    # Ejectuamos la consulta para obtener todos los datos
    data_query = f"SELECT * {query}"
    print(data_query)
    cursor.execute(data_query)
    routes = cursor.fetchall()

    routes_list = []

    if routes: 
        columns = [desc[0] for desc in cursor.description]

        for route in routes:
            route_dict = dict(zip(columns, route))
            for key, value in route_dict.items():
                if isinstance(value, date):
                    route_dict[key] = value.strftime('%Y-%m-%d')
                elif isinstance(value, timedelta):
                    total_seconds = int(value.total_seconds())
                    hours = total_seconds // 3600
                    minutes = (total_seconds % 3600) // 60
                    seconds = total_seconds % 60
                    route_dict[key] = f"{hours:02}:{minutes:02}:{seconds:02}"
            routes_list.append(route_dict)
            
    cursor.close()
    conn.close()

    return jsonify({
    'data': routes_list,
    'totalPages': total_pages
    })

@app.route("/api/packages", methods=['GET'])
def return_packages():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Obtenemos los filtros de la petición
    package_id = request.args.get('id')
    status = request.args.getlist('state')
    dict_status = {
        "Intento de entrega": "Delivery_attempted",
        "Entregado": "Delivered",
        "Rechazado": "Rejected",
    }
    start_time_window = request.args.get('startTimeWindow')
    end_time_window = request.args.get('endTimeWindow')
    low_planned_service_time = request.args.get('lowPlannedServiceTime')
    high_planned_service_time = request.args.get('highPlannedServiceTime')
    min_depth = request.args.get('minDepth')
    max_depth = request.args.get('maxDepth')
    min_width = request.args.get('minWidth')
    max_width = request.args.get('maxWidth')
    min_height = request.args.get('minHeight')
    max_height = request.args.get('maxHeight')
    route_id = request.args.get('routeId')
    stop_id = request.args.get('stopId')

    # Obtenemos los parametros de ordenación
    sort_key = request.args.get('sort')
    sort_direction = request.args.get('direction')

    # Obtenemos los parametros de paginacion
    limit = request.args.get('limit', type=int, default=20)  
    page = request.args.get('page', type=int, default=1) 

    # Construimos la petición 
    query = " FROM Package WHERE 1=1"

    # Añadimos los filtros a la petición
    if package_id:
        query += f" AND PackageId = '{package_id}'"

    if status:
        status_ids = []
        conditions = []
        parameterized_status = [dict_status[state] for state in status if state != 'Sin datos']

        if parameterized_status:
            placeholders = ', '.join(['%s'] * len(parameterized_status))
            cursor.execute(f"SELECT StatusId FROM Status WHERE StatusName IN ({placeholders})", parameterized_status)
            status_ids = [result[0] for result in cursor.fetchall()]

        if 'Sin datos' in status:
            conditions.append("StatusId IS NULL")

        if status_ids:
            conditions.append(f"StatusId IN ({', '.join(map(str, status_ids))})")

        print("AQUI")
        print(parameterized_status)
        if conditions:
            query += f" AND ({' OR '.join(conditions)})"
            
    if start_time_window and end_time_window:
        query += f" AND StartTimeWindow BETWEEN '{start_time_window}' AND '{end_time_window}'"
    elif start_time_window:
        query += f" AND StartTimeWindow >= '{start_time_window}'"
    elif end_time_window:
        query += f" AND StartTimeWindow <= '{end_time_window}'"
    
    if low_planned_service_time and high_planned_service_time:
        query += f" AND PlannedServiceTime BETWEEN {low_planned_service_time} AND {high_planned_service_time}"
    elif low_planned_service_time:
        query += f" AND PlannedServiceTime >= {low_planned_service_time}"
    elif high_planned_service_time:
        query += f" AND PlannedServiceTime <= {high_planned_service_time}"

    if min_depth and max_depth:
        query += f" AND Depth BETWEEN {min_depth} AND {max_depth}"
    elif min_depth:
        query += f" AND Depth >= {min_depth}"
    elif max_depth:
        query += f" AND Depth <= {max_depth}"

    if min_width and max_width:
        query += f" AND Width BETWEEN {min_width} AND {max_width}"
    elif min_width:
        query += f" AND Width >= {min_width}"
    elif max_width:
        query += f" AND Width <= {max_width}"

    if min_height and max_height:
        query += f" AND Height BETWEEN {min_height} AND {max_height}"
    elif min_height:
        query += f" AND Height >= {min_height}"
    elif max_height:
        query += f" AND Height <= {max_height}"

    if route_id:
        query += f" AND RouteId = '{route_id}'"

    if stop_id:
        query += f" AND StopId = '{stop_id}'"

    # Ejecutamos la consulta para obtener el número total de páginas
    count_query = f"SELECT COUNT(*) {query}"
    print(count_query)
    cursor.execute(count_query)
    total_count = cursor.fetchone()[0]
    total_pages = (total_count + limit - 1) // limit 

    # Añadimos los parametros de ordenación
    if sort_key and sort_direction:
        query += f" ORDER BY {sort_key} {sort_direction}"

    # Añadimos los parametros de paginacion
    if limit:
        query += f" LIMIT {limit}"
    if page:
        offset = (page - 1) * limit
        query += f" OFFSET {offset}"

    # Ejectuamos la consulta para obtener todos los datos
    data_query = f"SELECT * {query}"
    print(data_query)
    cursor.execute(data_query)
    packages = cursor.fetchall()

    packages_list = []

    if packages: 
        columns = [desc[0] for desc in cursor.description]

        for package in packages:
            packages_dict = dict(zip(columns, package))
            for key, value in packages_dict.items():
                if isinstance(value, datetime):
                    packages_dict[key] = value.strftime('%Y-%m-%d %H:%M:%S')
            packages_list.append(packages_dict)
            
    cursor.close()
    conn.close()

    return jsonify({
    'data': packages_list,
    'totalPages': total_pages
    })



if __name__ == '__main__':
    app.run(debug=True, port=8080)
