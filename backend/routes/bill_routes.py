from flask import Blueprint, request, jsonify
from models import db, Bill

bill_bp = Blueprint("bills", __name__)

@bill_bp.route("/bills", methods=["POST"])
def add_bill():
    data = request.get_json()
    bill = Bill(
        user_id=data["user_id"],
        name=data["name"],
        amount=data["amount"],
        due_date=data.get("due_date"),
        notes=data.get("notes")
    )
    db.session.add(bill)
    db.session.commit()
    return jsonify({"message": "Bill added"}), 201

@bill_bp.route("/bills/<int:user_id>", methods=["GET"])
def list_bills(user_id):
    bills = Bill.query.filter_by(user_id=user_id).all()
    return jsonify([
        {
            "id": b.id,
            "name": b.name,
            "amount": float(b.amount),
            "due_date": b.due_date.isoformat() if b.due_date else None
        }
        for b in bills
    ])
