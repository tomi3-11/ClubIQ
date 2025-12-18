from flask import Blueprint, jsonify, request
from app import db
from app.models import Club

activities_bp = Blueprint('activities', __name__, url_prefix="/api")

# The other operations goes here.