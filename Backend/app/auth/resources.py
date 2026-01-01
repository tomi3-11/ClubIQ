"""
Auth-related Flask-RESTful resources for clubIQ.

Includes:
- Syncing users from Clerk
- User profile retrieval
- Test endpoint to verify JWT auth
"""

from flask import request, g, current_app
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
            data = request.get_json() or {}

            # Ensure the payload clerk_id matches the token; allow first sync without existing user
            data["clerk_id"] = g.clerk_id

            claims = getattr(g, "clerk_claims", {}) or {}

            # Derive email from claims, then enforce consistency if user already exists
            email = data.get("email") or claims.get("email")
            if not email:
                email_addrs = claims.get("email_addresses") or []
                primary_id = claims.get("primary_email_address_id")
                primary = next((e for e in email_addrs if e.get("id") == primary_id), None)
                email = (primary or email_addrs[0] if email_addrs else {}).get("email_address") if email_addrs else None

            if g.current_user:
                email = g.current_user.email

            data["email"] = email

            # Derive display name and username if missing
            first = claims.get("first_name")
            last = claims.get("last_name")
            name = data.get("name") or " ".join([part for part in [first, last] if part]).strip()
            if not name:
                name = claims.get("username") or (email.split("@", 1)[0] if email else None)

            username = data.get("username") or claims.get("username") or (email.split("@", 1)[0] if email else None)

            role = data.get("role") or "user"

            data.update({
                "name": name,
                "username": username,
                "role": role,
            })

            debug_info = {
                "input": data,
                "derived_email": email,
                "derived_name": name,
                "derived_username": username,
                "role": role,
                "claims_keys": list(claims.keys()),
                "claims": claims,
            }

            # Log inbound payload and derived fields for debugging mapping
            current_app.logger.warning("Sync payload debug: %s", debug_info)
            print(f"SYNC_DEBUG {debug_info}", flush=True)

            # Validate required fields before calling service
            missing = [k for k in ("clerk_id", "name", "email", "username", "role") if not data.get(k)]
            if missing:
                current_app.logger.warning("Sync missing fields: %s payload=%s", missing, data)
                print(f"SYNC_MISSING {missing} payload={data}", flush=True)
                return {
                    "message": f"Missing fields: {', '.join(missing)}",
                    "missing": missing,
                    "debug": debug_info,
                }, 400

            response, status = AuthService.sync_user(data)
            return response, status
        except Exception as e:
            current_app.logger.exception("SyncUserResource error")
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
