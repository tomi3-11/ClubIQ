from flask_restful import Resource
from .service import InvitationService
from flask import request
from datetime import datetime


class InvitationListResource(Resource):
    def post(self):
        data = request.get_json() or {}

        email = data.get("email")
        expires_at = data.get("expires_at")

        if not email:
            return {"message": "Email is required"}, 400

        if expires_at:
            try:
                expires_at = datetime.fromisoformat(expires_at)
            except ValueError:
                return {"message": "Invalid expires_at format"}, 400

        # TEMP: replace with current_user.id when auth is ready
        """
        Recommended: use jwt_get_identity()
        simple prototype: (only when using tokens)
        user = User.query.get_or_404(get_jwt_identity()) -> simpley gets the currently logged in by checking the tokens
        then implement like this: "user.id"
        """
        invited_by = data.get("invited_by")
        if not invited_by:
            return {"message": "invited_by is required"}, 400

        invitation = InvitationService.create_invitation(
            email=email,
            invited_by=invited_by,
            expires_at=expires_at
        )

        return invitation, 201

    def get(self):
        status = request.args.get("status")
        invitations = InvitationService.list_invitations(status)
        return [inv.to_dict() for inv in invitations], 200


class InvitationDetailResource(Resource):
    def get(self, invite_id):
        invitation = InvitationService.get_invitation_by_id(invite_id)
        return invitation.to_dict(), 200


class AcceptInvitationResource(Resource):
    def post(self, token):
        invitation = InvitationService.accept_invitation(token)

        if not invitation:
            return {"message": "Invalid or expired token"}, 404

        return invitation, 200
