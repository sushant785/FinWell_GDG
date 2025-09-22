import os

class Config:


    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "postgresql://sushant:1234@localhost/finance_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disable tracking to save memory

    # ---------------- Security ----------------
    # Secret key for sessions, CSRF, JWTs, etc.
    SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-key")

    # ---------------- Debugging ----------------
    DEBUG = os.environ.get("DEBUG", "True") == "True"

    # ---------------- Optional / Future ----------------
    # JWT configs, email configs, API keys, etc. can be added here
