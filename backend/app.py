from flask import Flask, request, jsonify
from flask_cors import CORS  # import CORS
from models import db
from config import Config
from routes.auth_routes import auth_bp, bcrypt
from routes.bill_routes import bill_bp
from agent import ask_agent  # import your agent function

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
bcrypt.init_app(app)

# Enable CORS for all routes (allow frontend calls from localhost:3000)
CORS(app, origins=["http://localhost:3000"])  # Restrict to your frontend URL

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(bill_bp)

# Add the /ask route
@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"response": "❌ No prompt provided."}), 400

    result = ask_agent(prompt)
    return jsonify({"response": result})

if __name__ == "__main__":
    app.run(debug=True)
