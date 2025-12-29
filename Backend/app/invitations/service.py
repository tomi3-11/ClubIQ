from app.models import Invitation, InitationStatusEnum
import secrets
from app import db, mail
from datetime import datetime
from flask_mail import Message



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
    
    @staticmethod
    def send_invitation_email(email, token):
        invite_link = f"https:localhost:8000/invitations/accept/{token}"
        
        body = f"""
        Hello,

        You have been invited to join a club.

        Click the link below to accept the invitatio:
        {invite_link}

        Best regards
        ClubIQ Management System
        """
        
        EmailService.send_email(
            subject="You are Invited to join a Club",
            recipients=[email],
            body=body
        )




class EmailService:
    """
    Class for EmailService: This handles the sending of email during invitation.
    """
    @staticmethod
    def send_email(subject, recipients, body):
        """
        Docstring for send_email
        
        :param subject: This is the email subject
        :param recipients: This the email of the person recieving the mail 
        :param body: This is also know as the content of the email.
        """
        msg = Message(
            subject=subject,
            recipients=recipients,
            body=body
        )
        mail.send(msg)
    
    