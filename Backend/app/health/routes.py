from flask_restful import Resource, Api
from flask import Blueprint

health_bp = Blueprint("health", __name__, url_prefix='/api/health')
api = Api(health_bp)

class HealthResource(Resource):
    """
    This checks the status of the db (healthy & running)
    """
    def get(self):
        return {
            "message": "It feels good up here 😄"
        }
        
        
# Endpoint 
api.add_resource(HealthResource, '/')
