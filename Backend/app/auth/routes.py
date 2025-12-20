from flask import Blueprint, jsonify, request
from app.models import User
from flask_restful import Api, Resource
from app.auth.service import AuthService

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth/")
api = Api(auth_bp)


class SyncUserResource(Resource):
    def post(self):
        try:
            data = request.get_json()
            response, status = AuthService.sync_user(data)
            return response, status
        except Exception as e:
            return {"message": "Error syncing user", "error": str(e)}, 500
    
    
class ProfileResource(Resource):
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
        

# This does nothing other than just test the endpoints are work well       
class TestRoutesResource(Resource):
    def get(self):
        return {
            "message": "Auth routes working!"
        }, 200
        
        
        
# Endpoints
api.add_resource(SyncUserResource, "/sync/")
api.add_resource(ProfileResource, "/me/<int:user_id>/")
api.add_resource(TestRoutesResource, "/test/")
