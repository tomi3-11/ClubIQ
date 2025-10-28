"use client"

import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/auth.css"
import { AuthContext, useAuthContext } from "../AuthContext"

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthContext();

      useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

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
      }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>ClubIQ</h1>
          <p>Club Management & Performance Platform</p>
        </div>

        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" onClick={(e) => handleLogin(e, "member")}>
              Login as Member
            </button>
            <button type="submit" className="btn btn-secondary" onClick={(e) => handleLogin(e, "admin")}>
              Login as Admin
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account? <a href="/register">Sign up here</a>
            </p>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
