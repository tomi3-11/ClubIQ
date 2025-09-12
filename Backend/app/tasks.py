from app import scheduler, db, mail
from app.models import Member, Event, Attendance
from flask_mail import Message
from datetime import datetime, timedelta
from flask import current_app

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
                

def send_event_notifications():
    print("Running scheduled event notification job...")
    
    # We can access app, db, and mail via current_app
    with current_app.app_context():
    
        # Define a time frame (e.g., events in the next 3 days)
        start_date = datetime.now()
        end_date = start_date + timedelta(days=3)
        
        upcoming_events = Event.query.filter(
            Event.date >= start_date,
            Event.date <= end_date
        ).all()
        
        if not upcoming_events:
            print("No upcoming events found.")
            return
        
        all_members = Member.query.all()
        if not all_members:
            print("No members to notify.")
            return
        
        # Build the email body
        event_list_body = "\n".join([f"- {e.name} on {e.date.strftime('%Y-%m-%d at %H:%M')}" for e in upcoming_events])
        email_body = f"""Hello,
        
        Here are the upcoming events for this week:
        
        {event_list_body}
        
        See you there!
        """
        
        recipients = [member.email for member in all_members]
        
        msg = Message(
            'Upcoming Events Notification', 
            sender=('Club Tracker', 'noreply@clubiq.com'),
            recipients=recipients,
            body=email_body
        )
        
        mail.send(msg)
        print(f"Sent event notifications to {len(recipients)} members.")
        