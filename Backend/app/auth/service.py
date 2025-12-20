from app import db
from app.models import User


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
        
        synced_user = User(
            id=data.get("id"),
            clerk_id=data.get("clerk_id"),
            name=data.get("name"),
            email=data.get("email"),
            username=data.get("username")
        )
        
        # Add tot the db
        db.session.add(synced_user)
        db.session.commit()
        
        return {
            "message": "User synced successfully",
            "user": synced_user.to_dict(),
            "verified_via": "Clerk"
        }, 200
        