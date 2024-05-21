from app.database.db_mysql import db
from sqlalchemy.dialects.mysql import JSON

class ChartType(db.Model):
    __tablename__ = 'chart_type'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(50), nullable=False, unique=True)

class Chart(db.Model):
    __tablename__ = 'chart'

    id = db.Column(db.Integer, primary_key=True)
    config = db.Column(JSON, nullable=False)
    position = db.Column(db.Integer)
    type_id = db.Column(db.Integer, db.ForeignKey('chart_type.id'))

    type = db.relationship('ChartType', backref=db.backref('charts', lazy=True))
    likes = db.relationship('Liked', back_populates='chart', cascade='all, delete-orphan')

class Liked(db.Model):
    __tablename__ = 'liked'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    chart_id = db.Column(db.Integer, db.ForeignKey('chart.id'))
    city = db.Column(db.String(50))
    added_at = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

    user = db.relationship('User', back_populates='likes')
    chart = db.relationship('Chart', back_populates='likes')
