from app.models import Activity, db
from slugify import slugify


class ActivityService:
    
    @staticmethod
    def create_activity(user, data):
        title = data.get("title")
        description = data.get("description")
        
        if not title and not description:
            return {
                "message": "Title and description is required"
            }, 400
            
        slug = slugify(title)
        
        if Activity.query.filter_by(slug=slug).first():
            return {
                "message": "Activity already exists"
            }, 400
            
        activity = Activity(
            title=title,
            description=description,
            creator=user.username
        )
        
        db.session.add(activity)
        db.session.commit()
        
        return {
            "message": "Activity created successfully",
            "Details": activity.to_dict()
        }, 201
        
        
        
        
        