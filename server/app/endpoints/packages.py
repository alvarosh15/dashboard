from flask import Blueprint, jsonify, request
from app.models import Package, Status
from app.database import db

package_bp = Blueprint('package_bp', __name__)

package_column_mapping = {
    "PackageId": "package_id",
    "StatusId": "status_id",
    "StartTimeWindow": "start_time_window",
    "EndTimeWindow": "end_time_window",
    "PlannedServiceTime": "planned_service_time",
    "Depth": "depth",
    "Height": "height",
    "Width": "width",
    "RouteId": "route_id",
    "StopId": "stop_id"
}

@package_bp.route('/packages', methods=['GET'])
def return_packages():
    try:
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

        sort_key = request.args.get('sort')
        sort_direction = request.args.get('direction')

        limit = request.args.get('limit', type=int, default=20)  
        page = request.args.get('page', type=int, default=1) 

        query = Package.query

        if package_id:
            query = query.filter(Package.package_id == package_id)

        if status:
            status_ids = []
            conditions = []
            parameterized_status = [dict_status[state] for state in status if state != 'Sin datos']

            if parameterized_status:
                status_records = Status.query.filter(Status.status_name.in_(parameterized_status)).all()
                status_ids = [status.status_id for status in status_records]

            if 'Sin datos' in status:
                conditions.append(Package.status_id == None)

            if status_ids:
                conditions.append(Package.status_id.in_(status_ids))

            if conditions:
                query = query.filter(db.or_(*conditions))

        if start_time_window and end_time_window:
            query = query.filter(Package.start_time_window.between(start_time_window, end_time_window))
        elif start_time_window:
            query = query.filter(Package.start_time_window >= start_time_window)
        elif end_time_window:
            query = query.filter(Package.start_time_window <= end_time_window)

        if low_planned_service_time and high_planned_service_time:
            query = query.filter(Package.planned_service_time.between(low_planned_service_time, high_planned_service_time))
        elif low_planned_service_time:
            query = query.filter(Package.planned_service_time >= low_planned_service_time)
        elif high_planned_service_time:
            query = query.filter(Package.planned_service_time <= high_planned_service_time)

        if min_depth and max_depth:
            query = query.filter(Package.depth.between(min_depth, max_depth))
        elif min_depth:
            query = query.filter(Package.depth >= min_depth)
        elif max_depth:
            query = query.filter(Package.depth <= max_depth)

        if min_width and max_width:
            query = query.filter(Package.width.between(min_width, max_width))
        elif min_width:
            query = query.filter(Package.width >= min_width)
        elif max_width:
            query = query.filter(Package.width <= max_width)

        if min_height and max_height:
            query = query.filter(Package.height.between(min_height, max_height))
        elif min_height:
            query = query.filter(Package.height >= min_height)
        elif max_height:
            query = query.filter(Package.height <= max_height)

        if route_id:
            query = query.filter(Package.route_id == route_id)

        if stop_id:
            query = query.filter(Package.stop_id == stop_id)

        total_count = query.count()
        total_pages = (total_count + limit - 1) // limit

        if sort_key and sort_direction:
            mapped_sort_key = package_column_mapping.get(sort_key)
            sort_column = getattr(Package, mapped_sort_key)
            if sort_direction == 'ASC':
                query = query.order_by(sort_column.asc())
            elif sort_direction == 'DESC':
                query = query.order_by(sort_column.desc())

        packages = query.paginate(page=page, per_page=limit, error_out=False).items

        packages_list = [{"Id": package.id, "PackageId": package.package_id, "StatusId": package.status_id, 
                          "StartTimeWindow": package.start_time_window.strftime('%Y-%m-%d %H:%M:%S') if package.start_time_window else None, 
                          "EndTimeWindow": package.end_time_window.strftime('%Y-%m-%d %H:%M:%S') if package.end_time_window else None, 
                          "PlannedServiceTime": package.planned_service_time, "Depth": package.depth, 
                          "Height": package.height, "Width": package.width, "RouteId": package.route_id, 
                          "StopId": package.stop_id} for package in packages]

        return jsonify({"data": packages_list, "totalPages": total_pages}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Internal Server Error"}), 500
