from app.database import db
from sqlalchemy import ForeignKeyConstraint

class TransitTime(db.Model):
    __tablename__ = 'TransitTime'
    
    TransitTimeId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    TransitTime = db.Column(db.Float)
    RouteId = db.Column(db.String(100))
    OriginStopId = db.Column(db.String(100))
    EndStopId = db.Column(db.String(100))

    __table_args__ = (
        ForeignKeyConstraint(
            ['RouteId', 'OriginStopId'],
            ['Stop.RouteId', 'Stop.StopId']
        ),
        ForeignKeyConstraint(
            ['RouteId', 'EndStopId'],
            ['Stop.RouteId', 'Stop.StopId']
        ),
    )