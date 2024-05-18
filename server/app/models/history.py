from app.database.db_mysql import db
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.sql import func

class InputType(db.Model):
    __tablename__ = 'InputType'
    
    Id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Type = db.Column(db.String(50), nullable=False, unique=True)

    def __init__(self, Type):
        self.Type = Type

class History(db.Model):
    __tablename__ = 'History'
    
    Id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserId = db.Column(db.Integer, nullable=False)
    Inputs = db.Column(JSON, nullable=False)
    TypeId = db.Column(db.Integer, db.ForeignKey('InputType.Id'), nullable=False)
    AddedAt = db.Column(db.DateTime, default=func.now(), nullable=False)

