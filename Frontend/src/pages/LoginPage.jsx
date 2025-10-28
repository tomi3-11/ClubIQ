"use client";

import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { AuthContext, useAuthContext } from "../AuthContext";
import axios from "axios";
import getUserRole from "../util";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAthenticated } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // console.log('Attempting to log in with:', email, password);

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      // backend sends a token
      const token = response.data.access_token;

      login(token);
      localStorage.setItem("access_token", token); // store the token

      setMessage("Login successful!");
      console.log("Login successful, token stored!");
      const { isAdmin } = getUserRole();
      navigate(isAdmin ? "/admin-dashboard" : "/member-dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
      console.log("Login error:", error);
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <div className='auth-header'>
          <h1>ClubIQ</h1>
          <p>Club Management & Performance Platform</p>
        </div>

        <form className='auth-form'>
          <div className='form-group'>
            <label htmlFor='email'>Email Address</label>
            <input
              id='email'
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className='form-actions'>
            <button
              type='submit'
              className='btn btn-primary'
              onClick={(e) => handleLogin(e, "member")}
            >
              Login as Member
            </button>
            <button
              type='submit'
              className='btn btn-secondary'
              onClick={(e) => handleLogin(e, "admin")}
            >
              Login as Admin
            </button>
          </div>

          <div className='auth-footer'>
            <p>
              Don't have an account? <Link to='/register'>Sign up here</Link>
            </p>
            <Link to='#' className='forgot-password'>
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
