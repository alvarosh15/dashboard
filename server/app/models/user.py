from app.database import db

class User(db.Model):
    __tablename__ = 'user'
    
    Id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    GoogleId = db.Column(db.String(255), unique=True, nullable=False)
    Name = db.Column(db.String(255))
    Email = db.Column(db.String(255), unique=True, nullable=False)
    ImageUrl = db.Column(db.String(255))
