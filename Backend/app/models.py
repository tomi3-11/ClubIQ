import datetime
from app import db
import uuid
from sqlalchemy.dialects.postgresql import UUID
from enum import Enum


class User(db.Model):
    """
    User model to store user information.
    """
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    clerk_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    username = db.Column(db.String(30), unique=True, nullable=False)
    # image_url = db.Column(db.String(200), nullable=True)
    role = db.Column(db.String(50), nullable=False, default='user')
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "clerk_id": self.clerk_id,
            "name": self.name,
            "email": self.email,
            "username": self.username,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


    def __repr__(self):
        return f'<User {self.username}>'
    
class Club(db.Model):
    """
    Club model to store club information.
    """ 
    __tablename__ = "clubs"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(60), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    members = db.relationship(
        "ClubMember", backref="club", lazy="dynamic"
    )
    
    activities = db.relationship(
        "Activity", backref="club", lazy="dynamic"
    )
    
    def __repr__(self):
        return f'<Club {self.name}>'

class ClubMember(db.Model):
    """
    Club Member model to store membership information.
    """
    __tablename__ = "clubmembers"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    club_id = db.Column(UUID(as_uuid=True), db.ForeignKey('clubs.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='member')
    joined_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    user = db.relationship("User", backref="clubmembers")
    
    def to_dict(self):
        return {
            "id": self.id,
            "club_id": self.club_id,
            "user_id": self.user_id,
            "username": self.user.username if self.user else None,
            "role": self.role,
            "joined_at": self.joined_at.isoformat() if self.joined_at else None
        }

    def __repr__(self): 
        return f'<ClubMember UserID: {self.user_id} ClubID: {self.club_id}>'

class Activity(db.Model):
    """
    Activity model to store activity information.
    """
    __tablename__ = "activities"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    club_id = db.Column(UUID(as_uuid=True), db.ForeignKey('clubs.id'), nullable=True) # Nullable False to be implemented some other time.
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=True)
    end_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True) # Nullable False to be implemented some other time.

    author = db.relationship("User", backref="activities")
    tasks = db.relationship("Task", backref="activity", lazy="dynamic")
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "club_id": str(self.club_id),
            "title": self.title,
            "description": self.description,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "author_id": self.author_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<Activity {self.title}>'
    
    
class TaskStatusEnum(Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"

class Task(db.Model):
    """
    Task model to store task information.       
    """
    __tablename__ = "tasks"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    activity_id = db.Column(UUID(as_uuid=True), db.ForeignKey('activities.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    status = db.Column(
        db.Enum(TaskStatusEnum, name="task_status"),
        nullable=False,
        default=TaskStatusEnum.pending,
    )
    due_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    assignee = db.relationship("User", backref="assigned_tasks", foreign_keys=[assigned_to])
    ratings = db.relationship("Rating", backref="task", lazy="dynamic")
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "activity_id": str(self.activity_id),
            "title": self.title,
            "description": self.description,
            "assigned_to": self.assigned_to,
            "status": self.status.value,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<Task {self.title} Assigned to {self.assigned_to} Status {self.status}>'

class Rating(db.Model):
    """
    Rating model to store task ratings.
    """
    __tablename__ = "ratings"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tasks.id'), nullable=False)
    rated_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rated_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    comments = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    rated_user = db.relationship("User", backref="received_ratings", foreign_keys=[rated_user_id])
    rated_by = db.relationship("User", backref="given_ratings", foreign_keys=[rated_by_id])
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "task_id": str(self.task_id),
            "rated_user_id": self.rated_user_id,
            "rated_by_id": self.rated_by_id,
            "score": self.score,
            "comments": self.comments,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<Rating TaskID: {self.task_id} User: {self.rated_user} Score: {self.score}>'
    
    
class InitationStatusEnum(Enum):
    pending = "pending"
    in_progress = "in_progress"
    accepted = "accepted"

class Invitation(db.Model):
    """
    Invitation model to store invitation information.
    """
    __tablename__ = "invitations"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(120), nullable=False)
    
    club_id = db.Column(UUID(as_uuid=True), db.ForeignKey("clubs.id"), nullable=False)
    
    invited_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(200), unique=True, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='pending')
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    expirers_at = db.Column(db.DateTime, nullable=True)
    
    inviter = db.relationship("User", backref="sent_invitations")
    club = db.relationship("Club", backref="invitations")

    def __repr__(self):
        return f'<Invitation {self.email} Status: {self.status}>'


