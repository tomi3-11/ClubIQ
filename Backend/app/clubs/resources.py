from flask import request, g
from flask_restful import Resource
from app.auth.decorators import auth_required
from app.clubs.service import ClubService


class ClubResource(Resource):
    @auth_required()
    def get(self, club_id):
        return ClubService.get_club(club_id)

    @auth_required()
    def put(self, club_id):
        data = request.get_json()

        if not data:
            return {"error": "Missing JSON body"}, 400

        user = g.current_user
        return ClubService.update_club(club_id, data, user)

    @auth_required()
    def delete(self, club_id):
        user = g.current_user
        return ClubService.delete_club(club_id, user)


class ClubListResource(Resource):
    @auth_required()
    def get(self):
        return ClubService.list_clubs()

    @auth_required()
    def post(self):
        data = request.get_json()
        if not data:
            return {"error": "Missing JSON body"}, 400

        # Basic validation
        if 'name' not in data or not data['name']:
            return {"error": "Missing required field: name"}, 400

        user = g.current_user
        return ClubService.create_club(data, user)



