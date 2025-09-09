from flask import Blueprint

members_bp = Blueprint('members_bp', __name__)

from app.members import routes