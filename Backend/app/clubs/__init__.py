from flask import Blueprint
from .routes import register_blueprints

clubs_bp = Blueprint('clubs', __name__, url_prefix='/api/clubs')

register_blueprints(clubs_bp)

