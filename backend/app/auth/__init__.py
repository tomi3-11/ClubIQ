from flask import Blueprint
from .routes import register_routes


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth/")
register_routes(auth_bp)
