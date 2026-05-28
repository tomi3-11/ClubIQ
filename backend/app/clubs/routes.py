from app.clubs.resources import ClubListResource, ClubResource
from flask_restful import Api


def register_blueprints(bp):
    api = Api(bp)

    # Endpoints
    api.add_resource(ClubListResource, '/')
    api.add_resource(ClubResource, '/<string:club_id>')