from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from datetime import date, timedelta

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

@app.route("/api/routes", methods=['GET'])
def return_route():
    conn = get_db_connection()
    cursor = conn.cursor()

    id = request.args.get('id')
    scores = request.args.getlist('score')
    print(scores)
    cities = request.args.getlist('city')
    city_station_code = {
        'Los Angeles': 'DLA',
        'Seattle': 'DSE',
        'Chicago': 'DCH',
        'Boston': 'DBO',
        'Austin': 'DAU'
    }
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    start_time = request.args.get('startTime')
    end_time = request.args.get('endTime')
    low_capacity = request.args.get('lowCapacity')
    high_capacity = request.args.get('highCapacity')

    query = f"SELECT * FROM Route WHERE 1=1"

    if id:
        query += f" AND RouteId='{id}'"
    
    if scores:
        score_ids = []
        for score in scores:
            cursor.execute(f"SELECT ScoreId FROM Score WHERE ScoreName = '{score}'")
            result = cursor.fetchone()
            if result:
                score_ids.append(result[0])
        if score_ids:
            score_ids_str = ','.join(map(str, score_ids))
            query += f" AND ScoreId IN ({score_ids_str})"

    if cities:
        city_codes = [f"StationCode LIKE '{city_station_code[city]}%'" for city in cities]
        city_codes_str = ' OR '.join(city_codes)
        query += f" AND ({city_codes_str})"

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

    print(query)
    cursor.execute(query)
    routes = cursor.fetchall()

    if routes: 
        columns = [desc[0] for desc in cursor.description]
        #print(columns)
        routes_list = []

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

        #print(routes_list)

        return jsonify(routes_list)
    else:
        cursor.close()
        conn.close()
        return jsonify({'message': 'No routes found'})

if __name__ == '__main__':
    app.run(debug=True, port=8080)
