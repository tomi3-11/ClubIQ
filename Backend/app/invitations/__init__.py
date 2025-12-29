from .routes import register_routes
from flask import Blueprint

invitation_bp = Blueprint("invitations", __name__, url_prefix="/api/invitations/")

# pass the register route to finally accept the invitation blueprint
register_routes(invitation_bp)