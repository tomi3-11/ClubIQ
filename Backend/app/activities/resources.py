from flask import request
from flask_restful import Resource
from app.activities.service import ActivityService
from app.models import Club, User
# from flask_jwt_extended import jwt_required


class CreateActivityResource(Resource):
    # @jwt_required()
    def post(self):
        data = request.get_json()
        response, status = ActivityService.create_activity(data)
        return response, status
    
    
class ListActivityResource(Resource):
    def get(self, club_id):
        club = Club.query.filter_by(club_id=club_id).first()
        response = ActivityService.list_activities(club)
        return response
    

        