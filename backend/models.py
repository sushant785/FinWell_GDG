from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"          # 👈 change here
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    bills = db.relationship('Bill', backref='user', lazy=True)

class Bill(db.Model):
    __tablename__ = "bills"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # 👈 match new name
    name = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Numeric, nullable=False)
    due_date = db.Column(db.Date, nullable=True)
    notes = db.Column(db.String(255), nullable=True)
