from flask_restful import Api
from app.activities.resources import CreateActivityResource, ListActivityResource


def register_routes(bp):
    api = Api(bp)

    # endpoints
    api.add_resource(CreateActivityResource, "/create/")
    api.add_resource(ListActivityResource, "/<string:club_id>/")
        