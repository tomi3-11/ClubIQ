import os
from app import create_app, db
from app.models import Member, Event, Attendance, Project
from dotenv import load_dotenv

# Create the application instance
app = create_app()

# Load environmental variables from .env file
load_dotenv()

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