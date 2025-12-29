from app.models import Invitation, InitationStatusEnum
import secrets
from app import db
from datetime import datetime
import uuid


class InvitationService:
    
    @staticmethod
    def generate_token():
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def create_invitation(email, invited_by, expires_at=None):
        token = InvitationService.generate_token()
        
        invitation = Invitation(
            email=email,
            invited_by=invited_by,
            token=token,
            status="pending",
            created_at=datetime.utcnow(),
            expires_at=expires_at
        )
        db.session.add(invitation)
        db.session.commit()
        
        if isinstance(invitation, tuple):
            return invitation
        
        return invitation.to_dict()
    
    
    @staticmethod
    def get_invitation_by_id(invite_id):
        return Invitation.query.get_or_404(invite_id)
    
    
    @staticmethod
    def get_by_token(token):
        invitation = Invitation.query.filter_by(token=token).first()
        if invitation and invitation.expirers_at and invitation.expirers_at < datetime.utcnow():
            return None  # token expired
        return invitation
    
    
    @staticmethod
    def list_invitations(status=None):
        query = Invitation.query
        if status:
            query = query.filter_by(status=status)
        return query.order_by(Invitation.created_at.desc()).all()
    
    @staticmethod
    def accept_invitation(token):
        invitation = InvitationService.get_by_token(token)
        if not invitation:
            return None
        invitation.status = InitationStatusEnum.accepted
        db.session.commit()
        return invitation.to_dict()
    
    
    