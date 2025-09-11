# from datetime import datetime
import datetime
from app import db 
import uuid
from sqlalchemy.dialects.postgresql import UUID
 
# The Attendance association table
class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.datetime.now(datetime.timezone.utc))
    is_present = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<Attendance for Member: {self.member_id} at Event {self.event_id}>'
    

# Club Members Association Table
class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), index=True, unique=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    role = db.Column(db.String(64), default='member') # e.g., 'admin', 'member', 'revoked'
    absence_count = db.Column(db.Integer, default=0)
    status = db.Column(db.String(64), default='active') # e.g., 'active', 'revoked'
    join_date = db.Column(db.DateTime, index=True, default=datetime.datetime.utcnow)
    
    # Defining a relationship to the Attendance table
    attendance = db.relationship('Attendance', backref='member', lazy='dynamic')
    
    def __repr__(self):
        return f"<Member: {self.name}>"
    

# Club Events Table  
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(140), nullable=False)
    date = db.Column(db.DateTime, index=True, default=datetime.datetime.now(datetime.timezone.utc))
    description = db.Column(db.Text)
    # event_image = db.Column(db.Imaga)
    attendance_token = db.Column(db.String(32), nullable=True)
    token_expiry = db.Column(db.DateTime, nullable=True)
    event_type = db.Column(db.String(50), default='meeting')
    
    # Explicitly define the unique constraint
    __table_args__ = (db.UniqueConstraint('attendance_token', name='uq_event_attendance_token'),)
    
    attendance = db.relationship('Attendance', backref='event', lazy='dynamic')
    
    def __repr__(self):
        return f'<Event: {self.name}>'
    

# Club Project Table.
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(140), nullable=False)
    description = db.Column(db.Text)
    members = db.Column(db.String(256)) # Members will be stored in a comma-separated list of member names for simplicity
    status = db.Column(db.String(64), default='in progress') # e.g., 'in progress', 'completed'
    start_date = db.Column(db.DateTime, default=datetime.timezone.utc)
    end_date = db.Column(db.DateTime, nullable=True)
    
    def __repr__(self):
        return f"<Project: {self.title}>"
    
    
