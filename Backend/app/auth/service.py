"""
AuthService: Business logic for user authentication and sync.

Responsibilities:
- Create or update users in the database
- Ensure required fields are present
- Optional security: restrict sync to the currently logged-in user
"""

from app import db
from app.models import User
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError


class AuthService:
    """
    Service class for authentication-related business logic.
    """

    @staticmethod
    def sync_user(data: dict, current_user: User = None):
        """
        Create or update a user in the database.

        Args:
            data (dict): User data from Clerk. Must include:
                         'clerk_id', 'name', 'email', 'username', 'role'.
            current_user (User, optional): Authenticated user making the request.
                                           If provided, prevents syncing another user.

        Returns:
            tuple: (response_dict, HTTP status code)
        """
        if not data:
            return {"message": "No user data provided"}, 400

        # Required fields
        required_fields = ("clerk_id", "name", "email", "username", "role")
        for field in required_fields:
            if not data.get(field):
                return {"message": f"{field} is required"}, 400

        # Optional security: enforce that current_user can only sync themselves
        if current_user:
            data["clerk_id"] = current_user.clerk_id
            data["email"] = current_user.email

        # Check if user already exists by clerk_id or email
        existing_user = User.query.filter(
            or_(User.clerk_id == data.get("clerk_id"),
                User.email == data.get("email"))
        ).first()

        if existing_user:
            # Update existing user
            existing_user.name = data.get("name")
            existing_user.username = data.get("username")
            existing_user.role = data.get("role", existing_user.role)
            synced_user = existing_user
            message = "User updated successfully"
        else:
            # Create new user
            synced_user = User(
                clerk_id=data.get("clerk_id"),
                name=data.get("name"),
                email=data.get("email"),
                username=data.get("username"),
                role=data.get("role")
            )
            db.session.add(synced_user)
            message = "User created successfully"

        # Commit changes to database
        try:
            db.session.commit()
        except IntegrityError as exc:
            db.session.rollback()
            return {
                "message": "User sync failed due to duplicate email/username/clerk_id",
                "error": str(exc.orig),
            }, 409
        except Exception as exc:
            db.session.rollback()
            return {
                "message": "User sync failed",
                "error": str(exc),
            }, 500

        return {
            "message": message,
            "user": synced_user.to_dict(),
            "verified_via": "Clerk"
        }, 200
