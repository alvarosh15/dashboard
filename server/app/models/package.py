from app.database import db
from sqlalchemy import ForeignKeyConstraint
from sqlalchemy.dialects.mysql import ENUM

class Status(db.Model):
    __tablename__ = 'status'
    
    status_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status_name = db.Column(ENUM('DELIVERED', 'DELIVERY_ATTEMPTED', 'REJECTED'), nullable=False)

class Package(db.Model):
    __tablename__ = 'package'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    package_id = db.Column(db.String(100), nullable=False)
    status_id = db.Column(db.Integer, db.ForeignKey('status.status_id'))
    start_time_window = db.Column(db.DateTime)
    end_time_window = db.Column(db.DateTime)
    planned_service_time = db.Column(db.Integer)
    depth = db.Column(db.Float)
    height = db.Column(db.Float)
    width = db.Column(db.Float)
    route_id = db.Column(db.String(100), nullable=False)
    stop_id = db.Column(db.String(100), nullable=False)
    
    status = db.relationship('Status', backref=db.backref('packages', lazy=True))
    __table_args__ = (ForeignKeyConstraint(['route_id', 'stop_id'], ['stop.route_id', 'stop.stop_id']), {})