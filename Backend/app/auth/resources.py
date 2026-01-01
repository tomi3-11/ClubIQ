"""
Auth-related Flask-RESTful resources for clubIQ.

Includes:
- Syncing users from Clerk
- User profile retrieval
- Test endpoint to verify JWT auth
"""

from flask import request, g
from flask_restful import Resource
from app.models import User
from app.auth.service import AuthService
from .decorators import auth_required


class SyncUserResource(Resource):
    """
    Sync user from Clerk to internal database.

    Security:
    - Requires JWT verification to ensure request comes from a logged-in user
    - Optional: Restrict to specific roles (e.g., 'admin') if desired
    """

    @auth_required(require_synced=False)  # Allow first-time sync before user exists locally
    def post(self):
        """
        Create or update a user in the database using AuthService.sync_user.

        Optional security enhancement:
        - Force 'clerk_id' in payload to match g.current_user.clerk_id
          to prevent a user from syncing someone else's account.
        """
        try:
            data = request.get_json()

            if not data:
                return {"message": "No user data provided"}, 400

            # Ensure the payload clerk_id matches the token; allow first sync without existing user
            data["clerk_id"] = g.clerk_id

            # If we already have a synced user, enforce email consistency
            if g.current_user:
                data["email"] = g.current_user.email

            response, status = AuthService.sync_user(data)
            return response, status
        except Exception as e:
            return {"message": "Error syncing user", "error": str(e)}, 500


class ProfileResource(Resource):
    """
    Retrieve profile information for a given user by user_id.

    Security:
    - Requires authentication (any logged-in user)
    """
    @auth_required()  # Verification for any logged-in user
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        return {
            "id": user.id,
            "clerk_id": user.clerk_id,
            "email": user.email,
            "username": user.username,
            "role": user.role,
            "created_at": user.created_at.isoformat()
        }, 200


class TestAuthResource(Resource):
    """
    Test endpoint to verify JWT authentication.

    Returns the username of the authenticated user.
    """
    @auth_required()
    def get(self):
        return {
            "message": f"Hello, {g.current_user.username}!"
        }, 200
