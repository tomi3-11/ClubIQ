from app.models import Activity, db, Club, User

class ActivityService:
    # Removes author, to be implemented Some other time
    
    @staticmethod
    def create_activity(data):
        title = data.get("title")
        description = data.get("description")
        club_id = data.get("club_id")
        author_id = data.get("author_id")

        if not title:
            return {"message": "Title is required"}, 400
        if not club_id:
            return {"message": "club_id is required"}, 400

        club = Club.query.get(club_id)
        if not club:
            return {"message": "Club not found"}, 404

        author = None
        if author_id:
            author = User.query.get(author_id)
            if not author:
                return {"message": "Author not found"}, 404

        if Activity.query.filter_by(title=title, club_id=club_id).first():
            return {"message": "Activity already exists for this club"}, 400

        activity = Activity(
            title=title,
            description=description,
            club_id=club_id,
            author_id=author_id if author else None,
        )

        db.session.add(activity)
        db.session.commit()

        return {
            "message": "Activity created successfully",
            "Details": ActivityService._serialize(activity)
        }, 201
        
        
    @staticmethod
    def list_activities(club):
        if not club:
            return {"message": "Club not found"}, 404

        query = Activity.query.filter_by(club_id=club.id)

        activities = query.order_by(
            Activity.created_at.desc()
        ).all()

        return [ActivityService._serialize(a) for a in activities], 200
        
        
    @staticmethod
    def _serialize(activity):
        return {
            "id": str(activity.id), 
            "club_id": str(activity.club_id) if activity.club_id else None,
            "title": activity.title,
            "description": activity.description,
            "created_by": activity.author.username if activity.author else None,
            "created_at": activity.created_at.isoformat() if activity.created_at else None,
            "start_date": activity.start_date.isoformat() if activity.start_date else None,
        }
        
        
        