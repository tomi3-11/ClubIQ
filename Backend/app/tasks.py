from app import scheduler, db, mail
from app.models import Member, Event, Attendance
from flask_mail import Message
from datetime import datetime, timedelta

def send_absence_email(member):
    """
    Sends an email notification to a member about their absences.
    """
    # This is a placeholder for the email content
    # Can be formatted Later
    msg = Message(
        f"Notice of Absence from {member.absence_count} Meetings",
        sender='didymusthomas6@gmail.com',
        recipients=[member.email]
    )
    msg.body = (
        f"Hello {member.name}, \n\n"
        f"This is an automated notification regarding your recent absences from club meetings.\n\n"
        f"If you believe this is an error, please contact a club administrator.\n\n"
        f"Thank you, \n"
        f"The Club Administration"
    )
    mail.send(msg)
    
    
@scheduler.task('cron', id='check_absences', minute='0', hour='18')
def check_absences():
    """
    Scheduled task to check member absences and send emails.
    """
    with scheduler.app.app_context():
        # Get all members
        members = Member.query.all()
        
        for member in members:
            # Get the most recent events
            recent_events = Event.query.order_by(Event.date.desc()).limit(3).all()
            
            # Check attendance for each recent event
            absent_count = 0
            for event in recent_events:
                # Check if the member was present at this event
                attendance = Attendance.query.filter_by(
                    member_id=member.id,
                    event_id=event.id,
                    is_present=True 
                ).first()
                
                if not attendance:
                    absent_count += 1
                    
            # If a member has accumulated 3 consecutive absences, send an email
            if absent_count >= 3:
                member.absence_count = absent_count
                db.session.commit()
                send_absence_email(member)
    
    