from app.database import db
from sqlalchemy import ForeignKeyConstraint
from app.models.stop import Stop

class Package(db.Model):
    __tablename__ = 'Package'
    
    Id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    PackageId = db.Column(db.String(100), nullable=False)
    StatusId = db.Column(db.Integer, db.ForeignKey('Status.StatusId'))
    StartTimeWindow = db.Column(db.DateTime)
    EndTimeWindow = db.Column(db.DateTime)
    PlannedServiceTime = db.Column(db.Integer)
    Depth = db.Column(db.Float)
    Height = db.Column(db.Float)
    Width = db.Column(db.Float)
    RouteId = db.Column(db.String(100))
    StopId = db.Column(db.String(100))
    
    status = db.relationship('Status', backref=db.backref('packages', lazy=True))
    __table_args__ = (ForeignKeyConstraint(['RouteId', 'StopId'], ['Stop.RouteId', 'Stop.StopId']), {})