from flask import request, g
from flask_restful import Resource
from app.auth.decorators import auth_required
from app.rating.service import RatingService


class TaskRatingsResource(Resource):
    @auth_required(roles=["admin", "super_user", "club_manager"])
    def get(self, task_id):
        params = {
            "limit": request.args.get("limit"),
            "page": request.args.get("page"),
            "from": request.args.get("from"),
            "to": request.args.get("to"),
        }
        return RatingService.list_task_ratings(task_id, g.current_user, params)

    @auth_required(roles=["admin", "super_user"])
    def post(self, task_id):
        data = request.get_json() or {}
        return RatingService.create_rating(task_id, data, g.current_user)


class UserRatingsResource(Resource):
    @auth_required()
    def get(self, user_id):
        params = {
            "limit": request.args.get("limit"),
            "page": request.args.get("page"),
            "from": request.args.get("from"),
            "to": request.args.get("to"),
        }
        return RatingService.list_user_ratings(user_id, g.current_user, params)


class RatingResource(Resource):
    @auth_required(roles=["admin", "super_user"])
    def delete(self, rating_id):
        return RatingService.delete_rating(rating_id)
