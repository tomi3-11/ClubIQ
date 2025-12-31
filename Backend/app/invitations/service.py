from app.models import Invitation, InvitationStatusEnum, User, ClubMember
import secrets
from app import db, mail
from datetime import datetime
from flask_mail import Message


class InvitationService:

    @staticmethod
    def generate_token():
        return secrets.token_urlsafe(32)

    @staticmethod
    def create_invitation(email, invited_by, club_id, expires_at=None):
        token = InvitationService.generate_token()

        invitation = Invitation(
            email=email,
            invited_by=invited_by,
            club_id=club_id,
            token=token,
            status=InvitationStatusEnum.pending,
            expires_at=expires_at
        )

        db.session.add(invitation)
        db.session.commit()

        InvitationService.send_invitation_email(email, token)

        return invitation.to_dict()

    @staticmethod
    def get_by_token(token):
        invitation = Invitation.query.filter_by(token=token).first()

        if not invitation:
            return None

        if invitation.expires_at and invitation.expires_at < datetime.utcnow():
            return None

        return invitation

    @staticmethod
    def list_invitations(status=None):
        query = Invitation.query
        if status:
            query = query.filter_by(status=InvitationStatusEnum(status))
        return query.order_by(Invitation.created_at.desc()).all()

    @staticmethod
    def get_invitation_by_id(invite_id):
        return Invitation.query.get_or_404(invite_id)

    @staticmethod
    def accept_and_join_club(token, user_id):
        invitation = InvitationService.get_by_token(token)

        if not invitation:
            return None, "Invalid or expired token"

        if invitation.status != InvitationStatusEnum.pending:
            return None, "Invitation already used"

        user = User.query.get(user_id)
        if not user or user.email != invitation.email:
            return None, "This invitation is not for this user"

        existing = ClubMember.query.filter_by(
            club_id=invitation.club_id,
            user_id=user.id
        ).first()

        if existing:
            return None, "User already a club member"

        membership = ClubMember(
            club_id=invitation.club_id,
            user_id=user.id,
            role="member"
        )

        invitation.status = InvitationStatusEnum.accepted

        db.session.add(membership)
        db.session.commit()

        return {
            "club_id": str(invitation.club_id),
            "user_id": user.id,
            "role": membership.role
        }, None

    @staticmethod
    def invitation_status(token):
        invitation = InvitationService.get_by_token(token)

        if not invitation:
            return None

        user_exists = User.query.filter_by(email=invitation.email).first()

        return {
            "invitation": invitation.to_dict(),
            "user_exists": bool(user_exists)
        }

    @staticmethod
    def send_invitation_email(email, token):
        invite_link = f"http://localhost:8000/invitations/accept/{token}"

        body = f"""
Hello,

You have been invited to join a club.

Accept your invitation:
{invite_link}

Regards,
ClubIQ Management System
"""

        msg = Message(
            subject="You're invited to join a club",
            recipients=[email],
            body=body
        )
        mail.send(msg)
