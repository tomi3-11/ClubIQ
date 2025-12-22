from app.models import User
from flask_restful import Api
from .resources import SyncUserResource, ProfileResource, TestRoutesResource

def register_routes(bp):
    api = Api(bp)
    
    # Endpoints
    api.add_resource(SyncUserResource, "/sync/")
    api.add_resource(ProfileResource, "/me/<int:user_id>/")
    api.add_resource(TestRoutesResource, "/test/")
    
        
        
        
