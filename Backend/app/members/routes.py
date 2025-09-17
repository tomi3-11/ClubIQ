from flask import request, Blueprint
from flask_restful import Resource, Api
# from app.members import members_bp
from app import api, db, csrf
from app.models import Member, User
from app.forms import MemberForm
from flask_jwt_extended import jwt_required, get_jwt_identity

members_bp = Blueprint("members", __name__, url_prefix="/api/members")
api = Api(members_bp)

csrf.exempt(members_bp)


# def requires_roles(*role):
#     def wrapper(fn):
#         @jwt_required
#         def decorator(*args, **kwargs)

# Define a resource for a single member
class MemberResource(Resource):
    def get(self, member_id):
        member = Member.query.get_or_404(member_id)
        return {
            "id": member.id,
            "name": member.name,
            "email": member.email,
            "role": member.role,
            "absence_count": member.absence_count,
            "status": member.status,
            "join_date": member.join_date.isoformat(),
        }, 200
        
    @jwt_required()
    def put(self, member_id):
        member = Member.query.get_or_404(member_id)
        data = request.get_json()
        
        # Update fields if they are in the request
        if 'name' in data:
            member.name = data['name']
        if 'email' in data:
            member.email = data['email']
        if 'role' in data:
            member.role = data['role']
            
        db.session.commit()
        
        return {
            "message": "Member updated successfully",
            "id": member.id,
            "name": member.name,
            "email": member.email,
            "role": member.role,
        }, 200
        
        
    def delete(self, member_id):
        member = Member.query.get_or_404(member_id)
        db.session.delete(member)
        db.session.commit()
        return {
            "message": "Member deleted successfully"
        }, 200
        
        
# Define a resource for a collection of members
class MemberListResource(Resource):
    @jwt_required()
    def get(self):
        members = Member.query.all()
        member_list = []
        for member in members:
            member_list.append({
                "id": member.id,
                "name": member.name,
                "email": member.email,
                "role": member.role,
                "absence_count": member.absence_count,
                "status": member.status,
                "join_date": member.join_date.isoformat(),
            })
        return member_list, 200
    
    def post(self):
        data = request.get_json()
        if not data:
            return {"error": "Missing JSON body"}, 400
        
        # Basic validation
        required_fields = ["name", "email", "role"]
        
        for field in required_fields:
            if field not in data or not data[field]:
                return {
                    "error": f"Missing field: {field}"
                }, 400
        
        new_member = Member(
            name=data["name"],
            email=data["email"],
            role=data["role"]
        )  
        db.session.add(new_member)
        db.session.commit()
        return {
            "message": "Member created successfully", "id": new_member.id
        }, 200
        
# Add the resource to the API
api.add_resource(MemberListResource, '')
api.add_resource(MemberResource, '/<int:member_id>')
# api.add_resource(Me)
    