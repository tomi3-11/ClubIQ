from flask import request, Blueprint
from flask_restful import Resource, Api
# from app.events import events_bp
from app import db
from app.models import Event, Attendance
from app.forms import EventForm
import secrets
from datetime import datetime, timezone, timedelta
import pytz
from flask_jwt_extended import jwt_required

events_bp = Blueprint("events", __name__, url_prefix="/api/events")
api = Api(events_bp)


# Define a resource for a single event
class EventResource(Resource):
    def get(self, event_id):
        event = Event.query.get_or_404(event_id)
        return {
            "id": event.id,
            "name": event.name,
            "date": event.date.isoformat(),
            "description": event.description,
        }, 200
        
    def put(self, event_id):
        data = request.get_json()
        form = EventForm(data=data)
        if not form.validate():
            return form.errors, 400
        
        event = Event.query.get_or_404(event_id)
        event.name = form.name.data
        event.date = form.date.data
        event.description = form.description.data
        db.session.commit()
        
        return {
            "message": "Event updated successfully"
        }, 200
        
    def delete(self, event_id):
        event = Event.query.get_or_404(event_id)
        db.session.delete(event)
        db.session.commit()
        return {
            "message": "Event deleted successfully"
        }, 200


# Define a resource for a collection of events
class EventListResource(Resource):
    @jwt_required()
    def get(self):
        events = Event.query.all()
        event_list = [
            {
                "id": event.id,
                "name": event.name,
                "date": event.date.isoformat(),
                "description": event.description,
            } for event in events
        ]
        return event_list, 200
    
    def post(self):
        data = request.get_json()
        form = EventForm(data=data)
        if not form.validate():
            return form.errors, 400
        
        new_event = Event(
            name=form.name.data,
            date=form.date.data,
            description=form.description.data,
            event_type=form.event_type.data
        )
        db.session.add(new_event)
        db.session.commit()
        return {
            "message": "Event created successfully", "id": new_event.id
        }, 200
        
        
# The new resource for handling QR code attendance
class AttendanceResource(Resource):
    def get(self, event_id):
        # Admin request a secure token for the QR code 
        event = Event.query.get_or_404(event_id)
        
        # Generate a new, secure token
        token = secrets.token_urlsafe(16)
        
        # Setting the token's expiry to for example, 15 minutes from now
        expiry_time = datetime.now(timezone.utc) + timedelta(minutes=15)
        
        # Store the token and expiry in the database
        event.attendance_token = token
        event.token_expiry = expiry_time
        db.session.commit()
        
        return {
            "token": token,
            "message": "QR code token generated and stored"
        }, 200
        

class AttendanceCheckResource(Resource):
    def get(self, event_id, token, member_id):
        # User scans QR code, gets redirected here        
        event = Event.query.get_or_404(event_id)
        
        # 1. Check if the token matches the one stored for the event
        if event.attendance_token != token:
            return {
                "message": "Invalid attendance token."
            }, 400
            
        # 2. Check if the token has expired
        if event.token_expiry and event.token_expiry < datetime.now(timezone.utc):
            return {
                "message": "Attendance Token has expired."
            }, 400
            
        # If both Checks pass, mark attendance
        attendance_record = Attendance(member_id=member_id, event_id=event_id, is_present=True)
        db.session.add(attendance_record)
        
        event.attendance_token = None
        event.token_expiry = None
        
        db.session.commit()
        
        return {
            "message": "Attendance marked successfully"
        }, 200
        
    def post(self, event_id, token):
        data = request.get_json()
        member_id = data.get('member_id')
        
        if not member_id:
            return {
                "message": "Member ID is required."
            }, 400
            
        event = Event.query.get_or_404(event_id)
        
        # 1. Check if the token matches the one stored for the event
        if event.attendance_token != token:
            return {
                "message": "Invalid attendance token."
            }, 400
            
        # 2. Check if token has expired
        
        current_time = datetime.now(timezone.utc)
        if event.token_expiry and pytz.utc.localize(event.token_expiry) < current_time:
            return {"message": "Attendance Token has expired."}, 400
        
        # If both checks pass, mark attendance
        attendance_record = Attendance(member_id=member_id, event_id=event_id, is_present=True)
        db.session.add(attendance_record)
        
        event.attendance_token = None
        event.token_expiry = None
        
        db.session.commit()
        
        return {
            "message": "Attendance marked successfully"
        }, 200
        
        
# Add the resource to the API
api.add_resource(EventListResource, '')
api.add_resource(EventResource, '/<int:event_id>')
api.add_resource(AttendanceResource, '/<int:event_id>/qr')
api.add_resource(AttendanceCheckResource, '/<int:event_id>/attend/<string:token>')