"use client";

import { useState } from "react";
import "../../../styles/dashboard.css";
import Sidebar from "@/components/Sidebar";
import ActivityCard from "@/components/ActivityCard";
import RatingCard from "@/components/RatingCard";
import { useUser } from "@clerk/nextjs";
import useSignOut from "@/hooks/useSignOut";
import Profile from "@/components/member/Profile";
import Activities from "@/components/member/Activities";
import Overview from "@/components/member/Overview";

export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useUser();
  const { handleSignOut } = useSignOut();

  return (
    <div className='dashboard-container'>
      <Sidebar
        role='member'
        onLogout={handleSignOut}
        activeTab={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
      />

      <main className='dashboard-main'>
        <header className='dashboard-header'>
          <div className='header-content'>
            <h1>Welcome, {user?.username}!</h1>
            <p>Track your activities and performance</p>
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
            className={`tab ${activeTab === "activities" ? "active" : ""}`}
            onClick={() => setActiveTab("activities")}
          >
            My Activities
          </button>
          <button
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>

        {activeTab === "overview" && <Overview />}
        {activeTab === "activities" && <Activities />}
        {activeTab === "profile" && <Profile />}
      </main>
    </div>
  );
}
