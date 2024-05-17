from app.database import db
from sqlalchemy.dialects.mysql import ENUM

class Type(db.Model):
    __tablename__ = 'Type'
    
    TypeId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    TypeName = db.Column(ENUM('Station', 'Dropoff'), nullable=False)