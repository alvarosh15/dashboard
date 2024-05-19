from app.database.db_mysql import db
from sqlalchemy.dialects.mysql import JSON

class Liked(db.Model):
    __tablename__ = 'liked'
    
    Id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserId = db.Column(db.Integer, db.ForeignKey('user.Id'), nullable=False)
    Size = db.Column(db.String(255), nullable=False)
    Type = db.Column(db.String(255), nullable=False)
    Title = db.Column(db.String(255))
    City = db.Column(db.String(255))
    ColorPalette = db.Column(JSON)
    DataConfig = db.Column(JSON)
    LayoutConfig = db.Column(JSON)
    DataFetcher = db.Column(db.String(255), nullable=False)

    user = db.relationship('User', backref=db.backref('liked', lazy=True))
