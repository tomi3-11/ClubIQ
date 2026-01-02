from flask import Blueprint
from .routes import register_routes

ratings_bp = Blueprint('ratings', __name__, url_prefix='/api/ratings')
register_routes(ratings_bp)