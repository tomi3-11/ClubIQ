from flask_restful import Resource
from flask import request
from datetime import datetime
from .service import InvitationService


class InvitationListResource(Resource):

    def post(self):
        data = request.get_json() or {}

        email = data.get("email")
        club_id = data.get("club_id")
        expires_at = data.get("expires_at")
        invited_by = data.get("invited_by")  # TEMP → replace with auth

        if not all([email, club_id, invited_by]):
            return {"message": "email, club_id and invited_by are required"}, 400

        if expires_at:
            try:
                expires_at = datetime.fromisoformat(expires_at)
            except ValueError:
                return {"message": "Invalid expires_at format"}, 400

        invitation = InvitationService.create_invitation(
            email=email,
            invited_by=invited_by,
            club_id=club_id,
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


class InvitationAcceptResource(Resource):
    def post(self, token):
        data = request.get_json() or {}

        user_id = data.get("user_id")  # TEMP → replace with current_user.id
        if not user_id:
            return {"message": "User ID required"}, 400

        result, error = InvitationService.accept_and_join_club(token, user_id)

        if error:
            return {"message": error}, 400

        return {
            "message": "Successfully joined the club",
            "membership": result
        }, 200
