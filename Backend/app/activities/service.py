from app.models import Activity, db

class ActivityService:
    # Removes author, to be implemented Some other time
    
    @staticmethod
    def create_activity(data):
        title = data.get("title")
        description = data.get("description")
        
        if not title and not description:
            return {
                "message": "Title and description is required"
            }, 400
            
        
        if Activity.query.filter_by(title=title).first():
            return {
                "message": "Activity already exists"
            }, 400
            
        activity = Activity(
            title=title,
            description=description,
            # creator=user.username
        )
        
        db.session.add(activity)
        db.session.commit()
        
        return {
            "message": "Activity created successfully",
            "Details": ActivityService._serialize(activity)
        }, 201
        
        
    @staticmethod
    def list_activities(club):
        query = Activity.query.filter_by(club_id=club.id)
        
        activities = query.order_by(
            Activity.created_at.desc()
        ).all()
        
        return [ActivityService._serialize(a) for a in activities]
        
        
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
        
        
        