from flask import request, g
from flask_restful import Resource
from app.auth.decorators import auth_required
from app.members.service import MemberService


class MemberResource(Resource):
    @auth_required()
    def get(self, member_id):
        return MemberService.get_member(member_id)

    @auth_required(roles=["admin", "super_user"])
    def put(self, member_id):
        data = request.get_json() or {}
        return MemberService.update_member(member_id, data, g.current_user)

    @auth_required(roles=["admin", "super_user"])
    def delete(self, member_id):
        return MemberService.delete_member(member_id, g.current_user)


class MemberListResource(Resource):
    @auth_required()
    def get(self):
        return MemberService.list_members()

    @auth_required(roles=["admin", "super_user"])
    def post(self):
        data = request.get_json() or {}
        return MemberService.create_member(data, g.current_user)
