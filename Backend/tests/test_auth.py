import json

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