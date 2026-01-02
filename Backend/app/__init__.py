from flask import Flask, jsonify
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_mail import Mail
from flask_apscheduler import APScheduler
from config import Config
from flask_migrate import Migrate
import os
# from app.models import User, Event, Member, Attendance, Project

# Initialize extensions outside the factory
db = SQLAlchemy()
api = Api()
cors = CORS()
mail = Mail()
scheduler = APScheduler()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    if config_class is None:
        app.config.from_object(os.environ.get('FLASK_CONFIG_TYPE', 'default'))
    else:
        app.config.from_object(config_class)
    
    # Initialize extensions with the app instance
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    cors.init_app(app, supports_credentials=True)
    mail.init_app(app)
    scheduler.init_app(app)
    
    # Register blueprints for modularity
    from app.members import members_bp
    from app.auth import auth_bp
    from app.rating import ratings_bp
    from app.clubs import clubs_bp
    from app.activities import activities_bp
    from app.invitations import invitation_bp
    
    app.register_blueprint(members_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(ratings_bp)
    app.register_blueprint(clubs_bp)
    app.register_blueprint(activities_bp)
    app.register_blueprint(invitation_bp)

    
    return app
