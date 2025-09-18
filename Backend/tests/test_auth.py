import json
from app.models import User

def test_login_success(client):
    """
    GIVEN a running Flask application
    WHEN the '/api/login' endpoint is posted to with valid credentials
    THEN it should return a 200 OK status code and a JWT token.
    """
    
    # The client fixture is automatically provided by pytest from conftest.py
    response = client.post(
        '/api/login',
        data=json.dumps(dict(
            email='test_admin@example.com',
            password='test_password'
        )),
        content_type='application/json'
    )
    
    data = json.loads(response.data)
    assert response.status_code == 200
    assert 'access_token' in data
    assert isinstance(data['access_token'], str)
    
    
def test_login_invalid_credentials(client):
    """
    GIVEN a running Flask application
    WHEN the '/api/login' endpoint is posted to with invalid credentials
    THEN it should return a 401 Unauthorized status code.
    """
    response = client.post(
        '/api/login',
        data=json.dumps(dict(
            email='wrong@example.com',
            password='wrong_password'
        )),
        content_type='application/json'
    )
    
    data = json.loads(response.data)
    assert response.status_code == 401
    assert 'Invalid username or password' in data['message']
    
    
def test_registration_success(client, app):
    """
    GIVEN a running Flask application
    WHEN the '/api/register' endpoint is posted to with new user credentials
    THEN it should return a 201 Created status code and a success message.
    """
    new_user_email = 'new_user@example.com'
    response = client.post(
        '/api/register',
        data=json.dumps(dict(
            username='New User',
            email=new_user_email,
            password='new_password',
            confirm_password='new_password'
        )),
        content_type='application/json'
    )
    
    data = json.loads(response.data)
    assert response.status_code == 201
    assert 'User registered successfully' in data['message']
    
    # Very the new user exists in the database
    with app.app_context():
        user = User.query.filter_by(email=new_user_email).first()
        assert user is not None
        assert user.role == 'member' # Verifying that the default role is correct
        
        
def test_registration_duplicate_email(client, app):
    """
    GIVEN a running Flask application with an existing user
    WHEN the '/api/register' endpoint is posted to with a duplicate email
    THEN it should return a 409 Conflict status code and an error message.
    """
    # Using the test user created in the context fixture
    existing_user_email = 'test_admin@example.com'
    response = client.post(
        '/api/register',
        data=json.dumps(dict(
            username='Duplicate User',
            email=existing_user_email,
            password='some_password',
            confirm_password='some_password'
        )),
        content_type='application/json'
    )
    
    data = json.loads(response.data)
    assert response.status_code == 409
    assert 'Email already exists' in data['message']
    