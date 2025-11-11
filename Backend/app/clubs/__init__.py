from flask import Blueprint

clubs_bp = Blueprint('clubs', __name__, url_prefix='/api/clubs')

from app.clubs import routes