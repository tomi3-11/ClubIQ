from flask import Flask, jsonify
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect
from flask_mail import Mail
from flask_apscheduler import APScheduler
from config import Config
from flask_migrate import Migrate
import os
from flask_jwt_extended import JWTManager
# from app.models import User, Event, Member, Attendance, Project

# Initialize extensions outside the factory
db = SQLAlchemy()
api = Api()
cors = CORS()
csrf = CSRFProtect()
mail = Mail()
scheduler = APScheduler()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    if config_class is None:
        app.config.from_object(os.environ.get('FLASK_CONFIG_TYPE', 'default'))
    else:
        app.config.from_object(config_class)
        
    # Set the secret key for JWTs
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "my-secret-super_key-that-i-should-consider-changing-😁")
    
    # Initialize extensions with the app instance
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    cors.init_app(app)
    csrf.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)
    scheduler.init_app(app)
    
    # Register blueprints for modularity
    from app.members.routes import members_bp
    from app.events.routes import events_bp
    from app.core.routes import core_bp
    from app.auth.routes import auth_bp
    
    app.register_blueprint(members_bp)
    app.register_blueprint(events_bp)
    app.register_blueprint(core_bp)
    app.register_blueprint(auth_bp)
     
    from app.tasks import send_event_notifications
    # Start the scheduler
    if not scheduler.running:
        # scheduler.init_app(app)
        scheduler.start()
        
    # # Shell context processor
    # @app.shell_context_processor
    # def make_shell_context():
    #     return {"db": db, "User": User, "Event": Event, "Attendance": Attendance, "Project": Project}
    
    # Adding the scheduled job
    scheduler.add_job(
        id='send_event_notifications',
        func=send_event_notifications,
        trigger='interval',
        hours=24,
        replace_existing=True
    )
    
    
    return app