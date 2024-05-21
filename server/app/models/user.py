from app.database import db

class User(db.Model):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True) 
    name = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True, nullable=False)
    image_url = db.Column(db.String(255))

    likes = db.relationship('Liked', back_populates='user', lazy='joined')