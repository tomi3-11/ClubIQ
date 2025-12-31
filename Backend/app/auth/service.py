from app import db
from app.models import User
from sqlalchemy import or_


class AuthService:
    
    @staticmethod
    def sync_user(data):
        if not data:
            return {
                "message": "No user data provided"
            }, 400
            
        required_fields = ("clerk_id", "name", "email", "username", "role")
        
        for field in required_fields:
            if not data.get(field):
                return {
                    "message": f"{field} is required"
                }, 400
        
        existing_user = User.query.filter(
            or_(User.clerk_id == data.get("clerk_id"), User.email == data.get("email"))
        ).first()

        if existing_user:
            existing_user.name = data.get("name")
            existing_user.username = data.get("username")
            existing_user.role = data.get("role", existing_user.role)
            synced_user = existing_user
            message = "User updated successfully"
        else:
            synced_user = User(
                clerk_id=data.get("clerk_id"),
                name=data.get("name"),
                email=data.get("email"),
                username=data.get("username"),
                role=data.get("role")
            )
            db.session.add(synced_user)
            message = "User created successfully"

        db.session.commit()

        return {
            "message": message,
            "user": synced_user.to_dict(),
            "verified_via": "Clerk"
        }, 200
        