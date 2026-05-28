from flask import Blueprint
from flask_restful import Api, Resource

health_bp = Blueprint("health", __name__)
api = Api(health_bp)

class HealthResource(Resource):
    """
    Backend liveness probe endpoint used by Docker Compose.
    """

    def get(self):
        return {
            "status": "healthy",
            "message": "Backend service is running",
        }, 200


api.add_resource(
    HealthResource,
    "/backend-health",
    "/backend-health/",
    "/api/backend-health",
    "/api/backend-health/",
)
