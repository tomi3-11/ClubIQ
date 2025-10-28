"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/auth.css"

export default function RegisterPage({ onLogin }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    clubName: "",
    role: "member",
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = (e) => {
    e.preventDefault()
    if (formData.fullName && formData.email && formData.password) {
      onLogin(formData.role)
      navigate(formData.role === "admin" ? "/admin-dashboard" : "/member-dashboard")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Join ClubIQ</h1>
          <p>Create your account to get started</p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="clubName">Club Name (Optional)</label>
            <input
              id="clubName"
              type="text"
              name="clubName"
              placeholder="Tech Club"
              value={formData.clubName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Create Account
          </button>

          <div className="auth-footer">
            <p>
              Already have an account? <a href="/login">Login here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
