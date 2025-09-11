from flask import Blueprint, request
from flask_restful import Resource, Api
from app import db, api
from app.models import User
from app.forms import RegistrationForm
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__, url_prefix='/api')
api = Api(auth_bp)

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
        
        
class LoginResouce(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return {
                "message": "Username and password are required"
            }, 400
            
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            access_token = create_access_token(identity=str(user.id)) # Create a jwt
            return {
                "message": "Logged in successfully", "access_token": access_token
            }, 200
        else:
            return {
                "message": "Invalid username or password"
            }, 401
        
        
api.add_resource(RegisterResource, '/register')
api.add_resource(LoginResouce, '/login')