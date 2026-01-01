"""
Authorization decorators for the Flask application.

Provides:
- auth_required: verify JWT, map to DB user, enforce roles.
"""

from functools import wraps
from flask import request, g, current_app
from app.models import User 
from app.auth.clerk_jwt import verify_clerk_token


def auth_required(roles: list = None, require_synced: bool = True):
    """
    Decorator to protect endpoints
    
    Args:
        roles (list, optional): List of roles allowed to access the endpoints.
                                Example: ['admin', 'club_owner']
                                
    Usage:
        @auth_required(role=['admin'])
        def post(self):
            ...
    
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Extract Authorization header
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return {
                    "message": "Authorization token missing"
                }, 401
                
            token = auth_header.split(" ")[1]
            
            try:
                payload = verify_clerk_token(token)
            except Exception as exc:
                # Log for diagnostics; still return generic auth error to client
                current_app.logger.exception("Clerk token verification failed: %s", exc)
                return {
                    "message": "Invalid or expired token"
                }, 401
                
            clerk_id = payload.get("sub")
            if not clerk_id:
                return {
                    "message": "Invalid token payload"
                }, 401
            
            # Map Clerk ID to internal User (optional for initial sync)
            user = User.query.filter_by(clerk_id=clerk_id).first()
            if not user and require_synced:
                return {
                    "message": "User not synced"
                }, 403
            
            # Check role if provided (only when user is present)
            if roles and user and user.role not in roles:
                return {
                    "message": "Forbidden"
                }, 403
            
            # Attach to flask global context
            g.current_user = user  # may be None when require_synced is False
            g.clerk_id = clerk_id
            g.clerk_claims = payload
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator