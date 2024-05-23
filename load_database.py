import mysql.connector
import time
import json
import os

def processRouteData(cursor, file_path, isEvaluation=False):
    routes = json.load(open(file_path))
    for route in routes:

        route_id = route.replace('RouteID_', '')

        route_data = routes[route]
        station_code = route_data['station_code']
        date = route_data['date_YYYY_MM_DD']
        departure_time = route_data['departure_time_utc']
        executor_capacity = route_data['executor_capacity_cm3']
        stops = route_data['stops']

        if not isEvaluation:
            route_score = route_data['route_score']

            query = f"SELECT SCOREID FROM Score WHERE SCORENAME = '{route_score}';"
            cursor.execute(query)
            result = cursor.fetchone()
            if result:
                score_id = result[0]
            else:
                print(f"No se encontró un resultado para el RouteScore dado: {route_score}")

            query = f"INSERT INTO Route (RouteID,  StationCode, Date, DepartureTime, ExecutorCapacity, ScoreId) VALUES ('{route_id}', '{station_code}', '{date}', '{departure_time}', {executor_capacity}, '{score_id}');"
            cursor.execute(query)
        else: 
            query = f"INSERT INTO Route (RouteID,  StationCode, Date, DepartureTime, ExecutorCapacity) VALUES ('{route_id}', '{station_code}', '{date}', '{departure_time}', {executor_capacity});"
            cursor.execute(query)

        for stop_id in stops:

            stop_data = stops[stop_id]
            latitude = stop_data['lat']
            longitude = stop_data['lng']
            type = stop_data['type']
            zone_id = stop_data['zone_id']
            if not isNaN(stop_data['zone_id']):
                zone_id = stop_data['zone_id']
            else: 
                zone_id = None

            query = f"SELECT TYPEID FROM Type WHERE TYPENAME = '{type}';"
            cursor.execute(query)
            result = cursor.fetchone()
            if result:
                type_id = result[0]
            else:
                print(f"No se encontró un resultado para el Type dado: {type}")

            query = f"INSERT INTO Stop (RouteId, StopId, Latitude, Longitude, TypeId, ZoneId) VALUES ('{route_id}', '{stop_id}', {latitude}, {longitude}, '{type_id}', '{zone_id}');"
            cursor.execute(query)

def processActualSequence(cursor, file_path):
    actual_sequences = json.load(open(file_path))
    for route in actual_sequences:
        route_id = route.replace('RouteID_', '')
        actual = actual_sequences[route]['actual']
        i = 1
        for stop_tuple in actual.items():
            stop_id = stop_tuple[0]
            time_to_next = stop_tuple[1]
            query = f"UPDATE Stop SET OrderPosition = {i}, TimeToNext = {time_to_next} WHERE RouteId = '{route_id}' AND StopId = '{stop_id}';"
            cursor.execute(query)
            i += 1

def isNaN(num):
    return num != num

def processPackageData(cursor, file_path, isEvaluation=False):
    routes = json.load(open(file_path))
    for route in routes:
        route_id = route.replace('RouteID_', '')
        stops = routes[route] 
        for stop_id in stops:
            packages = stops[stop_id]
            for package in packages:
                package_id = package.replace('PackageID_', '')

                package_data = packages[package]
                if not isNaN(package_data['time_window']['start_time_utc']):
                    start_time_window = package_data['time_window']['start_time_utc']
                else: 
                    start_time_window = None
                if not isNaN(package_data['time_window']['end_time_utc']):
                    end_time_window = package_data['time_window']['end_time_utc']
                else:
                    end_time_window = None
                planned_service_time = package_data['planned_service_time_seconds']
                depth = package_data['dimensions']['depth_cm']
                height = package_data['dimensions']['height_cm']
                width = package_data['dimensions']['width_cm']

                if not isEvaluation:
                    scan_status = package_data['scan_status']
                    query = f"SELECT STATUSID FROM Status WHERE STATUSNAME = '{scan_status}';"
                    cursor.execute(query)
                    result = cursor.fetchone()
                    if result:
                        status_id = result[0]
                    else:
                        print(f"No se encontró un resultado para el Type dado: {scan_status}")

                    query = f"INSERT INTO Package (PackageId, StatusId, StartTimeWindow, EndTimeWindow, PlannedServiceTime, Depth, Height, Width, RouteId, StopId) VALUES ('{package_id}', {status_id}, %s, %s, {planned_service_time}, {depth}, {height}, {width}, '{route_id}', '{stop_id}');"
                    cursor.execute(query, (start_time_window, end_time_window))
                else:
                    query = f"INSERT INTO Package (PackageId, StartTimeWindow, EndTimeWindow, PlannedServiceTime, Depth, Height, Width, RouteId, StopId) VALUES ('{package_id}', %s, %s, {planned_service_time}, {depth}, {height}, {width}, '{route_id}', '{stop_id}');"
                    cursor.execute(query, (start_time_window, end_time_window))
        
def processTransitTimes(cursor, file_path):
    routes = json.load(open(file_path))
    for route in routes:
        route_id = route.replace('RouteID_', '')
        origin_stops = routes[route]
        for origin_stop_id in origin_stops:
            end_stops = origin_stops[origin_stop_id]
            for end_stop_id in end_stops:
                transit_time = end_stops[end_stop_id]
                if transit_time == 0:
                    continue
                query = f"INSERT INTO TransitTime (TransitTime, RouteId, OriginStopId, EndStopId) VALUES ({transit_time}, '{route_id}', '{origin_stop_id}', '{end_stop_id}');"
                cursor.execute(query)

try:

    # Obtenemos la ruta de los archivos donde tenemos el dataset
    # en nuestro caso se encuentra en el path 
    # /Users/alvaro/Amazon_Dataset, a partir de ahí
    # vamos obteniendo el path de todos los archivos que 
    # que queremos procesar
    home_dir = os.path.expanduser('~')
    file_path = os.path.join(home_dir, 'Amazon_Dataset')

    training_file_path = os.path.join(file_path, 'almrrc2021-data-training/model_build_inputs')
    training_route_data_file_path = os.path.join(training_file_path, 'route_data.json')
    training_actual_sequence_file_path = os.path.join(training_file_path, 'actual_sequences.json')
    training_package_data_file_path = os.path.join(training_file_path, 'package_data.json')
    training_travel_times_file_path = os.path.join(training_file_path, 'travel_times.json')

    evaluation_file_path = os.path.join(file_path, 'almrrc2021-data-evaluation/model_apply_inputs')
    evaluation_route_data_file_path = os.path.join(evaluation_file_path, 'eval_route_data.json')
    evaluation_package_data_file_path = os.path.join(evaluation_file_path, 'eval_package_data.json')
    evaluation_travel_times_file_path = os.path.join(evaluation_file_path, 'eval_travel_times.json')

    evaluation_file_path = os.path.join(file_path, 'almrrc2021-data-evaluation/model_score_inputs')
    evaluation_actual_sequence_file_path = os.path.join(evaluation_file_path, 'eval_actual_sequences.json')

    start_time = time.perf_counter()
    print("Conectando a la base de datos...")
    conn = mysql.connector.connect(
        host='localhost',
        user='alvaro',
        password='123456789',
        database='dashboard'
    )
    print("Conexión establecida")

    cursor = conn.cursor()

    print("Procesando el archivo route_data.json...")
    processRouteData(cursor, training_route_data_file_path)
    conn.commit()
    print("Procesando el archivo eval_route_data.json...")
    processRouteData(cursor, evaluation_route_data_file_path, True)
    conn.commit()
    print("Insertadas rutas y paradas correctamente")

    print("Procesando el archivo actual_sequence.json...")
    processActualSequence(cursor, training_actual_sequence_file_path)
    conn.commit()
    print("Procesando el archivo eval_actual_sequence.json...")
    processActualSequence(cursor, evaluation_actual_sequence_file_path)
    conn.commit()
    print("Insertadas las secuencias correctamente")

    print("Procesando el archivo package_data.json...")
    processPackageData(cursor, training_package_data_file_path)
    conn.commit()
    print("Procesando el archivo eval_package_data.json...")
    processPackageData(cursor, evaluation_package_data_file_path, True)
    conn.commit()
    print("Insertados los paquetes correctamente")

    print("Procesando el archivo travel_times.json...")
    processTransitTimes(cursor, training_travel_times_file_path)
    conn.commit()
    print("Procesando el archivo eval_travel_times.json...")
    processTransitTimes(cursor, evaluation_travel_times_file_path)
    conn.commit()
    print("Insertados los tiempos de viaje correctamente")

    end_time = time.perf_counter()
    print(f"Proceso completado en {(end_time - start_time)/60} minutos")

except mysql.connector.Error as err:
        print("Ha ocurrido un error")
        print(err.msg)
finally:
    cursor.close()
    conn.close()
    print("Conexión cerrada")