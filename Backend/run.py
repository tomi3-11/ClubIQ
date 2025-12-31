import os
from app import create_app, db
from app.models import User, Club, ClubMember, Activity, Invitation, Task, Rating
from dotenv import load_dotenv

# Load environmental variables from .env file before creating the app
load_dotenv()

# Create the application instance
app = create_app()

# Set up a shell context for easy debugging with 'flask shell'
@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Club': Club,
        'ClubMember': ClubMember,
        'Activity': Activity,
        'Invitation': Invitation,
        'Task': Task,
        'Rating': Rating
    }
    
    
if __name__ == "__main__":
    app.run(debug=True)