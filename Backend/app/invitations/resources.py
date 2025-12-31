from flask_restful import Resource
from flask import request
from datetime import datetime
from .service import InvitationService
from flask_jwt_extended import jwt_required, get_jwt_identity


class InvitationListResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json() or {}

        email = data.get("email")
        club_id = data.get("club_id")
        expires_at = data.get("expires_at")
        invited_by = get_jwt_identity()

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
    @jwt_required()
    def get(self, invite_id):
        invitation = InvitationService.get_invitation_by_id(invite_id)
        return invitation.to_dict(), 200


class InvitationAcceptResource(Resource):
    @jwt_required()
    def post(self, token):
        user_id = get_jwt_identity()

        result, error = InvitationService.accept_and_join_club(token, user_id)

        if error:
            return {"message": error}, 400

        return {
            "message": "Successfully joined the club",
            "membership": result
        }, 200
