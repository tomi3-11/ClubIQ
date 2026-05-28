from flask_restful import Api
from .resources import (
    InvitationListResource,
    InvitationDetailResource,
    InvitationAcceptResource,
)

def register_routes(bp):
    api = Api(bp)

    # Invitations collection (Create and list invitations)
    api.add_resource(InvitationListResource, '/')

    # Single invitation
    api.add_resource(InvitationDetailResource, '/<int:invite_id>')

    # Accept invitation (state change)
    api.add_resource(InvitationAcceptResource, '/<string:token>/accept')
