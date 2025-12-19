from flask import Blueprint

ratings_bp = Blueprint('rating', __name__)

from app.rating import routes 