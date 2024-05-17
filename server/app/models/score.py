from app.database import db
from sqlalchemy.dialects.mysql import ENUM

class Score(db.Model):
    __tablename__ = 'Score'
    
    ScoreId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ScoreName = db.Column(ENUM('Low', 'Medium', 'High'), nullable=False)
