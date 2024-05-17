from app.database import db

class Route(db.Model):
    __tablename__ = 'Route'
    
    RouteId = db.Column(db.String(255), primary_key=True)
    StationCode = db.Column(db.String(10))
    Date = db.Column(db.Date)
    DepartureTime = db.Column(db.Time)
    ExecutorCapacity = db.Column(db.Integer)
    ScoreId = db.Column(db.Integer, db.ForeignKey('Score.ScoreId'))
    
    score = db.relationship('Score', backref=db.backref('routes', lazy=True))