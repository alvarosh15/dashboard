from app.database import db

class Stop(db.Model):
    __tablename__ = 'Stop'
    
    RouteId = db.Column(db.String(100), db.ForeignKey('Route.RouteId'), primary_key=True)
    StopId = db.Column(db.String(100), primary_key=True)
    Latitude = db.Column(db.Float)
    Longitude = db.Column(db.Float)
    TypeId = db.Column(db.Integer, db.ForeignKey('Type.TypeId'))
    ZoneId = db.Column(db.String(10))
    OrderPosition = db.Column(db.Integer)
    TimeToNext = db.Column(db.Float)
    
    type = db.relationship('Type', backref=db.backref('stops', lazy=True))
    route = db.relationship('Route', backref=db.backref('stops', lazy=True))
