from app.database import db
from sqlalchemy.dialects.mysql import ENUM

class Score(db.Model):
    __tablename__ = 'score'
    
    score_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    score_name = db.Column(ENUM('Low', 'Medium', 'High'), nullable=False)

class Route(db.Model):
    __tablename__ = 'route'
    
    route_id = db.Column(db.String(100), primary_key=True)
    station_code = db.Column(db.String(10))
    date = db.Column(db.Date)
    departure_time = db.Column(db.Time)
    executor_capacity = db.Column(db.Integer)
    score_id = db.Column(db.Integer, db.ForeignKey('score.score_id'))
    
    score = db.relationship('Score', backref=db.backref('routes', lazy=True))