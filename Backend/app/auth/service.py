from app import db
from app.models import User


class AuthService:
    
    @staticmethod
    def sync_user(data):
        if not data:
            return {
                "message": "No user data provided"
            }, 400
            
        user_id = data.get("id")
        email = data.get("email")
        username = data.get("username")
        
        synced_user = User(
            id=user_id,
            email=email,
            username=username
        )
        
        # Add tot the db
        db.session.add(synced_user)
        db.session.commit()
        
        return {
            "message": "User synced successfully",
            "user": synced_user,
            "verified_via": "Clerk"
        }, 200
        