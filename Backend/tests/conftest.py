import pytest
from app import create_app, db
from app.models import User
from config import TestingConfig


@pytest.fixture(scope='session')
def app():
    """
    Fixture to set up a Flask application for testing.
    """
    app = create_app(TestingConfig)
    
    with app.app_context():
        # Create all database tables
        db.create_all()
        
        # Create a test user for authentication tests
        admin_user = User(
            username="Test Admin",
            email="test_admin@example.com",
            role="admin"
        )
        admin_user.set_password('test_password')
        db.session.add(admin_user)
        db.session.commit()
        
        yield app
        
        # Clean up the database after tests
        db.session.remove()
        db.drop_all()
        

@pytest.fixture(scope='function')
def client(app):
    """
    Fixture to get a test client for the application
    """
    return app.test_client()


@pytest.fixture(scope='function')
def runner(app):
    """
    Fixture to get a test runner for the application.
    """
    return app.test_cli_runner()