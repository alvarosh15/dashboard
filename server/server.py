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

@app.route("/api/routes/<id>", methods=['GET'])
def return_route_by_id(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    id = request.view_args['id']

    query = f"SELECT * FROM Route WHERE RouteId = '{id}'"
    cursor.execute(query)
    routes = cursor.fetchall()

    if routes: 
        columns = [desc[0] for desc in cursor.description]
        print(columns)
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

        print(routes_list)

        return jsonify(routes_list)
    else:
        cursor.close()
        conn.close()
        return jsonify({'message': 'No routes found'})

if __name__ == '__main__':
    app.run(debug=True, port=8080)
