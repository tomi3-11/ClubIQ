from flask import request, Blueprint
from flask_restful import Resource, Api
# from app.members import members_bp
from app import api, db
from app.models import ClubMember, User, Club
from app.forms import MemberForm
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

members_bp = Blueprint("members", __name__, url_prefix="/api/members")
api = Api(members_bp)

# csrf.exempt(members_bp)


def requires_roles(*roles):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            user_id = get_jwt_identity()
            print("JWT identity:", user_id)
            
            user = User.query.get(user_id)
            print("User Found:", user)
            
            if not user:
                return {"message": "User not found"}, 404
            
            if user.role == 'super_user':
                return fn(*args, **kwargs)
            
            if user.role not in roles:
                return {
                    "message": "Access forbidden: Insufficicent permissions"
                }, 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

# Define a resource for a single member
class MemberResource(Resource):
    @jwt_required()
    def get(self, member_id):
        member = ClubMember.query.get_or_404(member_id)
        return {
            "id": member.id,
            "club_id": member.club_id,
            "user_id": member.user_id,
            "username": member.user.username if member.user else None,
            "role": member.role,
            "joined_at": member.joined_at.isoformat() if member.joined_at else None,
        }, 200
        
    @requires_roles('admin')
    def put(self, member_id):
        member = ClubMember.query.get_or_404(member_id)
        data = request.get_json()
        
        # Update fields if they are in the request
        if 'role' in data:
            member.role = data['role']
            
        db.session.commit()
        
        return {
            "message": "Member updated successfully",
            "id": member.id,
            "role": member.role,
        }, 200
        
    @requires_roles('admin')
    def delete(self, member_id):
        member = ClubMember.query.get_or_404(member_id)
        db.session.delete(member)
        db.session.commit()
        return {
            "message": "Member deleted successfully"
        }, 200
        
        
# Define a resource for a collection of members
class MemberListResource(Resource):
    @jwt_required()
    def get(self):
        members = ClubMember.query.all()
        member_list = []
        for member in members:
            member_list.append({
                "id": member.id,
                "club_id": member.club_id,
                "user_id": member.user_id,
                "username": member.user.username if member.user else None,
                "role": member.role,
                "joined_at": member.joined_at.isoformat() if member.joined_at else None,
            })
        return member_list, 200
    
    @requires_roles('admin')
    def post(self):
        data = request.get_json()
        if not data:
            return {"error": "Missing JSON body"}, 400
        
        # Basic validation
        required_fields = ["club_id", "user_id"]
        for field in required_fields:
            if field not in data or not data[field]:
                return {"error": f"Missing field: {field}"}, 400

        club = Club.query.get(data["club_id"])
        if not club:
            return {"error": "Club not found"}, 404

        user = User.query.get(data["user_id"])
        if not user:
            return {"error": "User not found"}, 404

        existing = ClubMember.query.filter_by(club_id=club.id, user_id=user.id).first()
        if existing:
            return {"error": "User already a member of this club"}, 400

        role = data.get("role", "member")

        new_member = ClubMember(
            club_id=club.id,
            user_id=user.id,
            role=role
        )
        db.session.add(new_member)
        db.session.commit()
        return {
            "message": "Member created successfully",
            "id": new_member.id,
            "role": new_member.role,
        }, 201
        
# Add the resource to the API
api.add_resource(MemberListResource, '')
api.add_resource(MemberResource, '/<string:member_id>')
# api.add_resource(Me)
    
