from uuid import UUID
import secrets
from datetime import datetime, timezone
from sqlalchemy.exc import IntegrityError
from app.models import Invitation, InvitationStatusEnum, User, ClubMember, Club
from app import db, mail
from flask_mail import Message


def _parse_uuid(value):
    try:
        return UUID(str(value))
    except (ValueError, TypeError):
        return None


class InvitationService:
    @staticmethod
    def generate_token():
        return secrets.token_urlsafe(32)

    @staticmethod
    def _authorized(user, club):
        return user and (user.role in ["admin", "super_user"] or club.created_by == user.id)

    @staticmethod
    def create_invitation(data, current_user):
        if not current_user:
            return {"message": "User not synced"}, 403

        email = data.get("email")
        club_id = data.get("club_id")
        expires_at = data.get("expires_at")

        missing = [f for f in ["email", "club_id"] if not data.get(f)]
        if missing:
            return {"message": f"Missing field(s): {', '.join(missing)}"}, 400

        club_uuid = _parse_uuid(club_id)
        if not club_uuid:
            return {"message": "Invalid club id"}, 400

        club = db.session.get(Club, club_uuid)
        if not club:
            return {"message": "Club not found"}, 404

        if not InvitationService._authorized(current_user, club):
            return {"message": "Forbidden"}, 403

        parsed_expiry = None
        if expires_at:
            try:
                parsed_expiry = datetime.fromisoformat(expires_at)
            except ValueError:
                return {"message": "Invalid expires_at format"}, 400

        token = InvitationService.generate_token()
        invitation = Invitation(
            email=email,
            invited_by=current_user.id,
            club_id=club.id,
            token=token,
            status=InvitationStatusEnum.pending,
            expires_at=parsed_expiry,
        )

        db.session.add(invitation)
        try:
            db.session.commit()
        except IntegrityError as exc:
            db.session.rollback()
            return {"message": "Invitation creation failed", "error": str(exc.orig)}, 409
        except Exception as exc:
            db.session.rollback()
            return {"message": "Invitation creation failed", "error": str(exc)}, 500

        try:
            InvitationService.send_invitation_email(email, token)
        except Exception:
            # Email failures should not block creation; log in real deployments
            pass

        return {"message": "Invitation created", "invitation": invitation.to_dict()}, 201

    @staticmethod
    def get_by_token(token):
        invitation = Invitation.query.filter_by(token=token).first()
        if not invitation:
            return None
        if invitation.expires_at and invitation.expires_at < datetime.now(timezone.utc):
            return None
        return invitation

    @staticmethod
    def list_invitations(current_user, status=None):
        if not current_user:
            return {"message": "User not synced"}, 403

        query = Invitation.query
        if status:
            try:
                query = query.filter_by(status=InvitationStatusEnum(status))
            except ValueError:
                return {"message": "Invalid status"}, 400

        if current_user.role not in ["admin", "super_user"]:
            query = query.filter_by(invited_by=current_user.id)

        invitations = query.order_by(Invitation.created_at.desc()).all()
        return [inv.to_dict() for inv in invitations], 200

    @staticmethod
    def get_invitation_by_id(invite_id, current_user):
        if not current_user:
            return {"message": "User not synced"}, 403

        invite_uuid = _parse_uuid(invite_id)
        if not invite_uuid:
            return {"message": "Invitation not found"}, 404

        invitation = db.session.get(Invitation, invite_uuid)
        if not invitation:
            return {"message": "Invitation not found"}, 404

        if current_user.role not in ["admin", "super_user"] and not (
            invitation.invited_by == current_user.id or invitation.email == current_user.email
        ):
            return {"message": "Forbidden"}, 403

        return invitation.to_dict(), 200

    @staticmethod
    def accept_and_join_club(token, current_user):
        if not current_user:
            return {"message": "User not synced"}, 403

        invitation = InvitationService.get_by_token(token)
        if not invitation:
            return {"message": "Invalid or expired token"}, 400

        if invitation.status != InvitationStatusEnum.pending:
            return {"message": "Invitation already used"}, 400

        club = db.session.get(Club, invitation.club_id)
        if not club:
            return {"message": "Club not found"}, 404

        if current_user.email != invitation.email:
            return {"message": "This invitation is not for this user"}, 403

        existing = ClubMember.query.filter_by(
            club_id=invitation.club_id,
            user_id=current_user.id,
        ).first()
        if existing:
            return {"message": "User already a club member"}, 400

        membership = ClubMember(
            club_id=invitation.club_id,
            user_id=current_user.id,
            role="member",
        )

        invitation.status = InvitationStatusEnum.accepted

        db.session.add(membership)
        try:
            db.session.commit()
        except IntegrityError as exc:
            db.session.rollback()
            return {"message": "Invitation acceptance failed", "error": str(exc.orig)}, 409
        except Exception as exc:
            db.session.rollback()
            return {"message": "Invitation acceptance failed", "error": str(exc)}, 500

        return {
            "message": "Successfully joined the club",
            "membership": {
                "club_id": str(invitation.club_id),
                "user_id": current_user.id,
                "role": membership.role,
            },
        }, 200

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
