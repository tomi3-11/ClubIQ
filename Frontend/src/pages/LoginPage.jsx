"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/auth.css"

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e, role) => {
    e.preventDefault()
    if (email && password) {
      onLogin(role)
      navigate(role === "admin" ? "/admin-dashboard" : "/member-dashboard")
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
