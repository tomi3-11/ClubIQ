from flask_restful import Api
from .resources import SyncUserResource, ProfileResource, TestAuthResource

def register_routes(bp):
    api = Api(bp)
    
    # Endpoints
    api.add_resource(SyncUserResource, "/sync/")
    api.add_resource(ProfileResource, "/me/<int:user_id>/")
    api.add_resource(TestAuthResource, "/test/")
    
        
        
        
