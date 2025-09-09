from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect
from flask_mail import Mail
from flask_apscheduler import APScheduler
from config import Config
from flask_migrate import Migrate

# Initialize extensions outside the factory
db = SQLAlchemy()
api = Api()
cors = CORS()
csrf = CSRFProtect()
mail = Mail()
scheduler = APScheduler()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions with the app instance
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    cors.init_app(app)
    csrf.init_app(app)
    mail.init_app(app)
    
    # Register blueprints for modularity
    from app.members.routes import members_bp
    app.register_blueprint(members_bp, url_prefix='/api')
    
    # from app.members.routes import events_bp
    # app.register_blueprint(events_bp, url_prefix='/api')
    
    
    # Start the scheduler
    if not scheduler.running:
        scheduler.init_app(app)
        scheduler.start()
    
    
    return app