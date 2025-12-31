from flask import request
from flask_restful import Resource
from app.activities.service import ActivityService
from app.models import Club
from flask_jwt_extended import jwt_required, get_jwt_identity


class CreateActivityResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json() or {}
        data["author_id"] = get_jwt_identity()
        response, status = ActivityService.create_activity(data)
        return response, status
    
    
class ListActivityResource(Resource):
    @jwt_required()
    def get(self, club_id):
        club = Club.query.get(club_id)
        response, status = ActivityService.list_activities(club)
        return response, status
    

        