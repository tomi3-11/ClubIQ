from flask import request, Blueprint
from flask_restful import Resource, Api
from app.members import members_bp
from app import api, db
from app.models import Member
from app.forms import MemberForm

members_bp = Blueprint("members", __name__, url_prefix="/api/members")
api = Api(members_bp)

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
        
    
    def put(self, member_id):
        # NOTE: In a real app, you would parse the request JSON
        # and validate against the form
        
        data = request.get_json()
        form = MemberForm()
        if not form.validate_on_submit():
            return form.errors, 400
        
        
        member = Member.query.get_or_404(member_id)
        member.name = form.name.data
        member.email = form.email.data
        member.role = form.role.data
        db.session.commit()
        
        return {
            "message": "Member updated successfully"
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
                "join_date": member.join_date,
            })
        return member_list, 200
    
    def post(self):
        form = MemberForm()
        if not form.validate_on_submit():
            return form.errors, 400
        
        new_member = Member(
            name=form.name.data,
            email=form.email.data,
            role=form.role.data
        )  
        db.session.add(new_member)
        db.session.commit()
        return {
            "message": "Member created successfully", "id": new_member.id
        }, 200
        
# Add the resource to the API
api.add_resource(MemberListResource, '/api/members')
api.add_resource(MemberResource, '/api/members/<int:member_id>')
# api.add_resource(Me)
    