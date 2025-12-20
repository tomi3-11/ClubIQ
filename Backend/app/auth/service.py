from app import db
from app.models import User


class AuthService:
    
    @staticmethod
    def sync_user(self, data):
        if not data:
            return {
                "message": "No user data provided"
            }, 400
            
        user_id = data.get("id")
        email = data.get("email")
        username = data.get("username")
        
        synced_user = User(
            "clerk_user_id": user_id,
            "email": email,
            "username": username
        )
        
        # Add tot the db
        db.session.add(synced_user)
        db.session.commit()
        
        return {
            "message": "User synced successfully",
            "user": synced_user,
            "verified_via": "Clerk"
        }, 200
        
        
    @staticmethod
    def profile(self, user_id):
        user = User.query.get_or_404(user_id).first()
        return {
            "id": user.id,
            "clerk_id": user.clerk_id,
            "email": user.email,
            "username": user.username,
            "role": user.role,
            "created_at": user.created_at.isoformat(),
        }, 200