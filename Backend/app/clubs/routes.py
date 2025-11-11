from flask import jsonify, request
from flask_restful import Resource, Api
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models import Club, Club_member
from app.clubs import clubs_bp

api = Api(clubs_bp)


class ClubResource(Resource):
    @jwt_required()
    def get(self, club_id):
        club = Club.query.get_or_404(club_id)
        creator = Club_member.query.get(club.created_by)
        return {
            "id": club.id,
            "name": club.name,
            "description": club.description,
            "created_by": creator.username if creator else None,
            "created_at": club.created_at.isoformat() if club.created_at else None,
            "updated_at": club.updated_at.isoformat() if club.updated_at else None,
        }, 200

class ClubListResource(Resource):
    @jwt_required()
    def get(self):
        clubs = Club.query.all()
        clubs_data = []
        for club in clubs:
            creator = Club_member.query.get(club.created_by)
            clubs_data.append({
                "id": club.id,
                "name": club.name,
                "description": club.description,
                "created_by": creator.username if creator else None,
                "created_at": club.created_at.isoformat() if club.created_at else None,
                "updated_at": club.updated_at.isoformat() if club.updated_at else None,
            })
        return clubs_data, 200

api.add_resource(ClubListResource, '/')
api.add_resource(ClubResource, '/<int:club_id>')

