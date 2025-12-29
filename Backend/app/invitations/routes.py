from flask_restful import Api
from .resources import CreateInvitationResource, GetInvitationsResource, AcceptInvitationResource

def register_routes(bp):
    """
    Function for registering routes
    
    :param bp: the blueprint instance of the flask Blueprint class
    """
    
    api = Api(bp)
    
    # Register endpoints 
    api.add_resource(CreateInvitationResource, '/')
    api.add_resource(GetInvitationsResource, '/<int:invite_id>/')
    api.add_resource(AcceptInvitationResource, '/accept/<token>')