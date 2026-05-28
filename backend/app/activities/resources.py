from flask import request, g
from flask_restful import Resource
from app.activities.service import ActivityService
from app.auth.decorators import auth_required


class CreateActivityResource(Resource):
    @auth_required()
    def post(self):
        data = request.get_json() or {}
        return ActivityService.create_activity(data, g.current_user)


class ListActivityResource(Resource):
    @auth_required()
    def get(self, club_id):
        return ActivityService.list_activities(club_id)
    

        