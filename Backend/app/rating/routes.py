from flask_restful import Api
from app.rating.resources import RatingResource, TaskRatingsResource, UserRatingsResource


def register_routes(bp):
    api = Api(bp)

    api.add_resource(TaskRatingsResource, '/<string:task_id>/')
    api.add_resource(RatingResource, '/<string:rating_id>')
    api.add_resource(UserRatingsResource, '/user/<int:user_id>/')
