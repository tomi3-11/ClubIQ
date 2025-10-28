"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import MemberManagement from "../components/admin/MemberManagement"
import ActivityManagement from "../components/admin/ActivityManagement"
import RatingPanel from "../components/admin/RatingPanel"
import ReportsAnalytics from "../components/admin/ReportsAnalytics"
import "../styles/dashboard.css"

export default function AdminDashboard({ onLogout }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" onLogout={handleLogout} />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Manage clubs, members, and activities</p>
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
          <button className={`tab ${activeTab === "members" ? "active" : ""}`} onClick={() => setActiveTab("members")}>
            Members
          </button>
          <button
            className={`tab ${activeTab === "activities" ? "active" : ""}`}
            onClick={() => setActiveTab("activities")}
          >
            Activities
          </button>
          <button className={`tab ${activeTab === "ratings" ? "active" : ""}`} onClick={() => setActiveTab("ratings")}>
            Ratings
          </button>
          <button className={`tab ${activeTab === "reports" ? "active" : ""}`} onClick={() => setActiveTab("reports")}>
            Reports
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === "overview" && (
            <div className="admin-overview">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Members</div>
                  <div className="stat-value">48</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Active Activities</div>
                  <div className="stat-value">12</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Avg Rating</div>
                  <div className="stat-value">4.1/5</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Completion Rate</div>
                  <div className="stat-value">87%</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "members" && <MemberManagement />}
          {activeTab === "activities" && <ActivityManagement />}
          {activeTab === "ratings" && <RatingPanel />}
          {activeTab === "reports" && <ReportsAnalytics />}
        </div>
      </main>
    </div>
  )
}
