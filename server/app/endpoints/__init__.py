from app.endpoints.score import score_bp
from app.endpoints.type import type_bp
from app.endpoints.status import status_bp
from app.endpoints.routes import route_bp
from app.endpoints.stops import stop_bp
from app.endpoints.packages import package_bp
from app.endpoints.charts import charts_bp
from app.endpoints.map import map_bp
from app.endpoints.auth import auth_bp
from app.endpoints.history import history_bp

def register_blueprints(app):
    app.register_blueprint(score_bp)
    app.register_blueprint(type_bp)
    app.register_blueprint(status_bp)
    app.register_blueprint(route_bp)
    app.register_blueprint(stop_bp)
    app.register_blueprint(package_bp)
    app.register_blueprint(charts_bp)
    app.register_blueprint(map_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(history_bp)
    
