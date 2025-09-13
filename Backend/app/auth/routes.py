from flask import Blueprint, request
from flask_restful import Resource, Api
from app import db, api, csrf
from app.models import User
from app.forms import RegistrationForm
from flask_jwt_extended import create_access_token
from flask_mail import Message
from app import mail
from datetime import datetime, timezone, timedelta
import secrets
from werkzeug.security import generate_password_hash
import pytz
# from app import csrf

auth_bp = Blueprint('auth', __name__, url_prefix='/api')
api = Api(auth_bp)

csrf.exempt(auth_bp)

class RegisterResource(Resource):
    def post(self):
        data = request.get_json()
        form = RegistrationForm(data=data)
        
        if not form.validate():
            return form.errors, 400
        
        # Check for existing username or email
        if User.query.filter_by(username=form.username.data).first():
            return {
                "message": "Username already exists"
            }, 409
        if User.query.filter_by(email=form.email.data).first():
            return {
                "message": "Email already exists"
            }, 409
            
        # Create new user and set password
        new_user = User(
            username=form.username.data,
            email=form.email.data,
        )
        new_user.set_password(form.password.data)
        
        db.session.add(new_user)
        db.session.commit()
        
        return {
            "message": "User registered successfully"
        }, 201
        
        
class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return {
                "message": "Username and password are required"
            }, 400
            
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            access_token = create_access_token(identity=str(user.id)) # Create a jwt
            return {
                "message": "Logged in successfully", "access_token": access_token
            }, 200
        else:
            return {
                "message": "Invalid username or password"
            }, 401
            
            
class PasswordResetRequestResource(Resource): 
    def post(self):
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return {
                "message": "Email is required"
            }, 400
            
        user = User.query.filter_by(email=email).first()
        if user:
            # Generate a secure token with an expiry time in the database or cache
            token = secrets.token_urlsafe(32)
            
            # Store the token  and its expiry time
            user.reset_token = token
            user.token_expiry = datetime.now(timezone.utc) + timedelta(hours=1)
            db.session.commit()
            
            msg = Message('Password Reset request',
                          sender=('Club IQ', 'noreply@clubiq.com'),
                          recipients=[user.email])
            
            msg.body = f"""To reset your password, visit the following link: {request.url_root}reset_password/{token}
            If you did not make this request then simply ignore this email and no changes will be made
            """
            
            mail.send(msg)
            
        return {
            "message": "If an account with that email exists, a password reset link has been sent"
        }, 200
        
        
class PasswordResetResource(Resource):
    def post(self, token):
        data = request.get_json()
        new_password = data.get('new_password')
        
        if not new_password:
            return {"message": "New Password is required"}, 400
        
        # Find the user by the provided token and check its expiry
        user = User.query.filter_by(reset_token=token).first()
        
        if not user or pytz.utc.localize(user.token_expiry) < datetime.now(timezone.utc):
            return {"message": "Invalid or expired token"}, 400
        
        # Set the new password and clear the token fields
        user.password_hash = generate_password_hash(new_password)
        user.reset_token = None
        user.token_expiry = None
        db.session.commit()
        
        return {"message": "Password updated successfully"}, 200
        
        
api.add_resource(RegisterResource, '/register')
api.add_resource(LoginResource, '/login')
api.add_resource(PasswordResetRequestResource, '/reset_request')
api.add_resource(PasswordResetResource, '/reset_password/<string:token>')