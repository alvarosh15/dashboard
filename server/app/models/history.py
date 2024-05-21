from app.database.db_mysql import db
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.sql import func

class InputType(db.Model):
    __tablename__ = 'input_type'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(50), nullable=False, unique=True)

class History(db.Model):
    __tablename__ = 'History'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    input = db.Column(JSON, nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey('input_type.id'), nullable=False)
    added_at = db.Column(db.DateTime, default=func.now(), nullable=False)

    input_type = db.relationship('InputType', backref='histories', lazy='joined')