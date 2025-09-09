from flask import Blueprint, jsonify
# from app import csrf
from flask_wtf.csrf import generate_csrf

core_bp = Blueprint('core', __name__)

@core_bp.route('/csrf-token', methods=['GET'])
def get_csrf_token():
    return jsonify({'csrf_token': generate_csrf()})