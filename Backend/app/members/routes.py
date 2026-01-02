from .resources import MemberListResource, MemberResource
from flask_restful import Api
    

def register_routes(bp):
    api = Api(bp)

    # Blueprints
    api.add_resource(MemberListResource, '/')
    api.add_resource(MemberResource, '/<string:member_id>')