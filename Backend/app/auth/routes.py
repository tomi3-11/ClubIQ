from flask import Blueprint, request
from flask_restful import Resource, Api
from app import db, api
from app.models import User
from app.forms import RegistrationForm

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
        
        

        
        
api.add_resource(RegisterResource, '/register')