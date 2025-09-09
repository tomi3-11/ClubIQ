import os
from app import create_app, db
from app.models import Member, Event, Attendance, Project

# Create the application instance
app = create_app()

# Set up a shell context for easy debugging with 'flask shell'
@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'Member': Member,
        'Event': Event,
        'Attendance': Attendance,
        'Project': Project,
    }
    
    
if __name__ == "__main__":
    app.run(debug=True)