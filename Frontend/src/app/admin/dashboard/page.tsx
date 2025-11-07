"use client";

import { useState } from "react";

import "../../../styles/dashboard.css";
import Sidebar from "@/components/Sidebar";
import MemberManagement from "@/components/admin/MemberManagement";
import ActivityManagement from "@/components/admin/ActivityManagement";
import RatingPanel from "@/components/admin/RatingPanel";
import ReportsAnalytics from "@/components/admin/ReportsAnalytics";
import useSignOut from "@/hooks/useSignOut";
import Overview from "@/components/admin/Overview";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const { handleSignOut } = useSignOut();

  return (
    <div className='dashboard-container'>
      <Sidebar
        role='admin'
        onLogout={handleSignOut}
        activeTab={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
      />

      <main className='dashboard-main'>
        <header className='dashboard-header'>
          <div className='header-content'>
            <h1>Admin Dashboard</h1>
            <p>Manage clubs, members, and activities</p>
          </div>
          <button className='btn btn-outline' onClick={handleSignOut}>
            Logout
          </button>
        </header>

        <div className='dashboard-tabs'>
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button>
          <button
            className={`tab ${activeTab === "activities" ? "active" : ""}`}
            onClick={() => setActiveTab("activities")}
          >
            Activities
          </button>
          <button
            className={`tab ${activeTab === "ratings" ? "active" : ""}`}
            onClick={() => setActiveTab("ratings")}
          >
            Ratings
          </button>
          <button
            className={`tab ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            Reports
          </button>
        </div>

        <div className='dashboard-content'>
          {activeTab === "overview" && <Overview />}
          {activeTab === "members" && <MemberManagement />}
          {activeTab === "activities" && <ActivityManagement />}
          {activeTab === "ratings" && <RatingPanel />}
          {activeTab === "reports" && <ReportsAnalytics />}
        </div>
      </main>
    </div>
  );
}
