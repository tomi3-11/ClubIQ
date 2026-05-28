from flask import Blueprint
from .routes import register_routes

activities_bp = Blueprint("activities", __name__, url_prefix="/api/activities/")

register_routes(activities_bp)