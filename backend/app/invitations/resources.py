from flask_restful import Resource
from flask import request, g
from .service import InvitationService
from app.auth.decorators import auth_required


class InvitationListResource(Resource):
    @auth_required()
    def post(self):
        data = request.get_json() or {}
        return InvitationService.create_invitation(data, g.current_user)

    @auth_required()
    def get(self):
        status = request.args.get("status")
        return InvitationService.list_invitations(g.current_user, status)


class InvitationDetailResource(Resource):
    @auth_required()
    def get(self, invite_id):
        return InvitationService.get_invitation_by_id(invite_id, g.current_user)


class InvitationAcceptResource(Resource):
    @auth_required()
    def post(self, token):
        return InvitationService.accept_and_join_club(token, g.current_user)
