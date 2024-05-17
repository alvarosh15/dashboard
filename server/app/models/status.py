from app.database import db
from sqlalchemy.dialects.mysql import ENUM

class Status(db.Model):
    __tablename__ = 'Status'
    
    StatusId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    StatusName = db.Column(ENUM('DELIVERED', 'DELIVERY_ATTEMPTED', 'REJECTED'), nullable=False)
