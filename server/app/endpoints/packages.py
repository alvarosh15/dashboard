from flask import Blueprint, jsonify, request
from app.models.package import Package
from app.models.status import Status
from app.database import db

package_bp = Blueprint('package_bp', __name__)

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
            query = query.filter(Package.PackageId == package_id)

        if status:
            status_ids = []
            conditions = []
            parameterized_status = [dict_status[state] for state in status if state != 'Sin datos']

            if parameterized_status:
                status_records = Status.query.filter(Status.StatusName.in_(parameterized_status)).all()
                status_ids = [status.StatusId for status in status_records]

            if 'Sin datos' in status:
                conditions.append(Package.StatusId == None)

            if status_ids:
                conditions.append(Package.StatusId.in_(status_ids))

            if conditions:
                query = query.filter(db.or_(*conditions))

        if start_time_window and end_time_window:
            query = query.filter(Package.StartTimeWindow.between(start_time_window, end_time_window))
        elif start_time_window:
            query = query.filter(Package.StartTimeWindow >= start_time_window)
        elif end_time_window:
            query = query.filter(Package.StartTimeWindow <= end_time_window)

        if low_planned_service_time and high_planned_service_time:
            query = query.filter(Package.PlannedServiceTime.between(low_planned_service_time, high_planned_service_time))
        elif low_planned_service_time:
            query = query.filter(Package.PlannedServiceTime >= low_planned_service_time)
        elif high_planned_service_time:
            query = query.filter(Package.PlannedServiceTime <= high_planned_service_time)

        if min_depth and max_depth:
            query = query.filter(Package.Depth.between(min_depth, max_depth))
        elif min_depth:
            query = query.filter(Package.Depth >= min_depth)
        elif max_depth:
            query = query.filter(Package.Depth <= max_depth)

        if min_width and max_width:
            query = query.filter(Package.Width.between(min_width, max_width))
        elif min_width:
            query = query.filter(Package.Width >= min_width)
        elif max_width:
            query = query.filter(Package.Width <= max_width)

        if min_height and max_height:
            query = query.filter(Package.Height.between(min_height, max_height))
        elif min_height:
            query = query.filter(Package.Height >= min_height)
        elif max_height:
            query = query.filter(Package.Height <= max_height)

        if route_id:
            query = query.filter(Package.RouteId == route_id)

        if stop_id:
            query = query.filter(Package.StopId == stop_id)

        total_count = query.count()
        total_pages = (total_count + limit - 1) // limit

        if sort_key and sort_direction:
            sort_column = getattr(Package, sort_key)
            if sort_direction == 'asc':
                query = query.order_by(sort_column.asc())
            elif sort_direction == 'desc':
                query = query.order_by(sort_column.desc())

        packages = query.paginate(page=page, per_page=limit, error_out=False).items

        packages_list = [{"Id": package.Id, "PackageId": package.PackageId, "StatusId": package.StatusId, 
                          "StartTimeWindow": package.StartTimeWindow.strftime('%Y-%m-%d %H:%M:%S') if package.StartTimeWindow else None, 
                          "EndTimeWindow": package.EndTimeWindow.strftime('%Y-%m-%d %H:%M:%S') if package.EndTimeWindow else None, 
                          "PlannedServiceTime": package.PlannedServiceTime, "Depth": package.Depth, 
                          "Height": package.Height, "Width": package.Width, "RouteId": package.RouteId, 
                          "StopId": package.StopId} for package in packages]

        return jsonify({"data": packages_list, "totalPages": total_pages}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500
