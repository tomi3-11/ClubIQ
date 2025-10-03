import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { Link, useNavigate } from 'react-router-dom';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { login, isAthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // console.log('Attempting to log in with:', email, password);

        try {
            const response = await axios.post('/api/login', {
                email,
                password
            });

            // backend sends a token
            const token = response.data.access_token;

            login(token);
            localStorage.setItem('access_token', token); // store the token

            setMessage('Login successful!');
            console.log('Login successful, token stored!')
            navigate('/dashboard');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed');
            console.log('Login error:', error.response.data);
        }
    };


    useEffect(() => {
        if (isAthenticated) {
            navigate('/dashboard');
        }
    }, [isAthenticated, navigate]);

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                </div>

                <div>
                    <label>Password:</label>
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                </div>

                <button type="submit">Login</button>
            </form>

            <div>
                <Link to="/forgot_password">Forgot Password</Link>
            </div>

            <div style={{ marginTop: '10px'}}>
                Don't have an account? <Link to={"/register"}>Register here.</Link>
            </div>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;