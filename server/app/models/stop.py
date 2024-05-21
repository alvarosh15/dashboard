from app.database import db
from sqlalchemy.dialects.mysql import ENUM
from sqlalchemy import ForeignKeyConstraint

class TransitTime(db.Model):
    __tablename__ = 'transit_time'
    
    transit_time_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    transit_time = db.Column(db.Float)
    route_id = db.Column(db.String(100))
    origin_stop_id = db.Column(db.String(100))
    end_stop_id = db.Column(db.String(100))

    __table_args__ = (
        ForeignKeyConstraint(
            ['route_id', 'origin_stop_id'],
            ['stop.route_id', 'stop.stop_id'],
            name='fk_origin_stop'
        ),
        ForeignKeyConstraint(
            ['route_id', 'end_stop_id'],
            ['stop.route_id', 'stop.stop_id'],
            name='fk_end_stop'
        ),
    )

class Type(db.Model):
    __tablename__ = 'type'
    
    type_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type_name = db.Column(ENUM('Station', 'Dropoff'), nullable=False)


class Stop(db.Model):
    __tablename__ = 'stop'
    
    route_id = db.Column(db.String(100), db.ForeignKey('route.route_id'), primary_key=True)
    stop_id = db.Column(db.String(100), primary_key=True)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    type_id = db.Column(db.Integer, db.ForeignKey('type.type_id'))
    zone_id = db.Column(db.String(10))
    order_position = db.Column(db.Integer)
    time_to_next = db.Column(db.Float)
    
    type = db.relationship('Type', backref=db.backref('stops', lazy=True))
    route = db.relationship('Route', backref=db.backref('stops', lazy=True))
