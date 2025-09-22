from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from models import db, User
import os
from werkzeug.utils import secure_filename

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@auth_bp.route("/signup", methods=["POST"])


def signup():
    # Get text data from form
    username = request.form.get("username")
    email = request.form.get("email")
    phone = request.form.get("phone")
    password = request.form.get("password")

    # Get file data
    file = request.files.get("file")

    if not all([username, email, phone, password,file]):
        return jsonify({"error": "All fields are required"}), 400

    if User.query.filter(
        (User.username == username) | (User.email == email) | (User.phone == phone)
    ).first():
        return jsonify({"error": "User already exists"}), 409

    # Save file if provided
    filename = None
    if file:
        if not file.filename.endswith(".csv"):
            return jsonify({"error": "Only CSV files are allowed"}), 400
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

    # Hash password and create user
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, phone=phone, password_hash=pw_hash)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully",
        "file_saved": filename if filename else "No file uploaded"
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"message": "Login successful", "username": user.username}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
