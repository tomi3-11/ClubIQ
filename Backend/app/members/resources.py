from flask import request, g
from flask_restful import Resource
from app.auth.decorators import auth_required
from app.members.service import MemberService


class MemberResource(Resource):
    @auth_required()
    def get(self, member_id):
        return MemberService.get_member(member_id)

    @auth_required()
    def put(self, member_id):
        data = request.get_json() or {}
        return MemberService.update_member(member_id, data, g.current_user)

    @auth_required()
    def delete(self, member_id):
        return MemberService.delete_member(member_id, g.current_user)


class MemberListResource(Resource):
    @auth_required()
    def get(self):
        mine = (request.args.get("mine", "false").lower() in ["1", "true", "yes"])
        club_id = request.args.get("club_id")
        return MemberService.list_members(g.current_user, mine=mine, club_id=club_id)

    @auth_required()
    def post(self):
        data = request.get_json() or {}
        return MemberService.create_member(data, g.current_user)
