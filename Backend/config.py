import os

class Config:
    # Using SQLite for local development
    if os.environ.get('DATABASE_URL'):
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    else:
        # For local develpement with SQLite
        basedir = os.path.abspath(os.path.dirname(__file__))
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')    
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "my-secret-super_key-that-i-should-consider-changing-😁")

    # Clerk configuration
    CLERK_FRONTEND_API = os.environ.get("CLERK_FRONTEND_API")
    CLERK_AUDIENCE = os.environ.get("CLERK_AUDIENCE")  # fallback key some setups use
    CLERK_ISSUER = os.environ.get("CLERK_ISSUER")
    CLERK_JWKS_URL = os.environ.get("CLERK_JWKS_URL", "https://api.clerk.dev/v1/jwks")

    
    # Secret key for sessions and CSRF protection
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-very-hard-to-guess-string'
    
    # APScheduler Configuration
    SCHEDULER_API_ENABLED = True
    
    # Mail configuration
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS') is not None
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    
class TestingConfig(Config):
    Testing = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:' # in-memory SQLite for testing
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', "my-secret-super_key-that-i-should-consider-changing-😁")
    WTF_CSRF_ENABLED = False # This disables CSRF For Testing
    
    