import datetime
from app import db
import uuid
from sqlalchemy.dialects.postgresql import UUID
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    """
    User model to store user information.
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    clerk_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    username = db.Column(db.String(30), unique=True, nullable=False)
    image_url = db.Column(db.String(200), nullable=True)
    role = db.Column(db.String(50), nullable=False, default='user')
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def __repr__(self):
        return f'<User {self.username}>'
    
class Club(db.Model):
    """
    Club model to store club information.
    """ 
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(60), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def __repr__(self):
        return f'<Club {self.name}>'

class Club_member(db.Model):
    """
    Club Member model to store membership information.
    """
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    club_id = db.Column(UUID(as_uuid=True), db.ForeignKey('clubs.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='member')
    joined_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self): 
        return f'<ClubMember UserID: {self.user_id} ClubID: {self.club_id}>'

class Activity(db.Model):
    """
    Activity model to store activity information.
    """
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    club_id = db.Column(UUID(as_uuid=True), db.ForeignKey('clubs.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.DateTime, nullable=True)
    end_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f'<Activity {self.title}>'

class Task(db.Model):
    """
    Task model to store task information.       
    """
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    activity_id = db.Column(UUID(as_uuid=True), db.ForeignKey('activities.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    assigned_to = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    status = db.Column(db.String(50), nullable=False, default='pending')
    due_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f'<Task {self.title} Assigned to {self.assigned_to} Status {self.status}>'

class Rating(db.Model):
    """
    Rating model to store task ratings.
    """
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tasks.id'), nullable=False)
    rated_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rated_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    comments = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f'<Rating TaskID: {self.task_id} User: {self.rated_user} Score: {self.score}>'

class Invitation(db.Model):
    """
    Invitation model to store invitation information.
    """
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(120), nullable=False)
    invited_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    token = db.Column(db.String(200), unique=True, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    expirers_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Invitation {self.email} Status: {self.status}>'
    