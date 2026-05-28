from flask import Blueprint
from .routes import register_routes

members_bp = Blueprint("members", __name__, url_prefix="/api/members")
register_routes(members_bp)