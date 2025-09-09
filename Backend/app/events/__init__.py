from flask import Blueprint

events_bp = Blueprint('events_bp', __name__)

from app.events import routes
