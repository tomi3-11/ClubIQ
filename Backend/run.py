import os
from app import create_app, db
from app.models import User, Club, Club_member, Activity, Invitation, Task, Rating
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
        'User': User,
        'Club': Club,
        'Club_member': Club_member,
        'Activity': Activity,
        'Invitation': Invitation,
        'Task': Task,
        'Rating': Rating
    }
    
    
if __name__ == "__main__":
    app.run(debug=True)