"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import ActivityCard from "../components/ActivityCard"
import RatingCard from "../components/RatingCard"
import "../styles/dashboard.css"

export default function MemberDashboard({ onLogout }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  const activities = [
    { id: 1, title: "Tech Fair Organization", status: "Completed", rating: 4.5, date: "2024-10-15" },
    { id: 2, title: "Workshop Presentation", status: "Pending", rating: null, date: "2024-11-01" },
    { id: 3, title: "Community Outreach", status: "Reviewed", rating: 4.0, date: "2024-09-20" },
  ]

  const ratings = {
    average: 4.2,
    participation: 4,
    teamwork: 4,
    timeliness: 5,
    leadership: 4,
  }

  return (
    <div className="dashboard-container">
      <Sidebar role="member" onLogout={handleLogout} />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Welcome, Alice!</h1>
            <p>Track your activities and performance</p>
          </div>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === "activities" ? "active" : ""}`}
            onClick={() => setActiveTab("activities")}
          >
            My Activities
          </button>
          <button className={`tab ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
            Profile
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Average Rating</div>
                <div className="stat-value">{ratings.average}/5</div>
                <div className="stat-bar">
                  <div className="stat-fill" style={{ width: `${(ratings.average / 5) * 100}%` }}></div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Activities Completed</div>
                <div className="stat-value">12</div>
                <div className="stat-subtitle">3 this month</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Participation Score</div>
                <div className="stat-value">{ratings.participation}/5</div>
                <div className="stat-subtitle">Excellent</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Badges Earned</div>
                <div className="stat-value">5</div>
                <div className="stat-subtitle">Active Member, Star Volunteer</div>
              </div>
            </div>

            <div className="section">
              <h2>Recent Activities</h2>
              <div className="activities-list">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            <div className="section">
              <h2>Performance Ratings</h2>
              <div className="ratings-grid">
                <RatingCard label="Participation" value={ratings.participation} />
                <RatingCard label="Teamwork" value={ratings.teamwork} />
                <RatingCard label="Timeliness" value={ratings.timeliness} />
                <RatingCard label="Leadership" value={ratings.leadership} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "activities" && (
          <div className="dashboard-content">
            <div className="section">
              <h2>My Activities</h2>
              <div className="activities-list">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="dashboard-content">
            <div className="profile-section">
              <h2>Profile Settings</h2>
              <div className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue="Alice Johnson" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue="alice@example.com" />
                </div>
                <div className="form-group">
                  <label>Club</label>
                  <input type="text" defaultValue="Tech Club" />
                </div>
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
