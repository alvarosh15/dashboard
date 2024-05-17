from flask import Blueprint, jsonify, request
from app.models.user import User
from app.database import db
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/auth/google', methods=['POST'])
def google_auth():
    try:
        data = request.json
        user_info = data.get("user")

        if not user_info:
            return jsonify({"error": "User information is required"}), 400

        google_id = user_info['id']
        name = user_info['name']
        email = user_info['email']
        image_url = user_info['image']

        existing_user = User.query.filter_by(GoogleId=google_id).first()

        if existing_user is None:
            new_user = User(GoogleId=google_id, Name=name, Email=email, ImageUrl=image_url)
            db.session.add(new_user)
            db.session.commit()
            user_id = new_user.Id
        else:
            user_id = existing_user.Id

        access_token = create_access_token(identity={"id": user_id, "name": name, "email": email})
        print("Access token:", access_token)
        return jsonify({"AccessToken": access_token}), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500
