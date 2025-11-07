"use client";

import { useState } from "react";
import "../styles/sidebar.css";

type SidebarProps = {
  role: "admin" | "member";
  onLogout: () => void;
  onSelect?: (tab: string) => void;
  activeTab?: string;
};

export default function Sidebar({
  role,
  onLogout,
  onSelect,
  activeTab,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  
  const memberMenuItems = [
    { label: "Dashboard", icon: "📊", tab: "overview" },
    { label: "My Activities", icon: "📋", tab: "activities" },
    //{ label: "My Ratings", icon: "⭐", tab: "ratings" },
    { label: "Profile", icon: "👤", tab: "profile" },
  ];

  const adminMenuItems = [
    { label: "Dashboard", icon: "📊", tab: "overview" },
    { label: "Members", icon: "👥", tab: "members" },
    { label: "Activities", icon: "📋", tab: "activities" },
    //{ label: "Ratings", icon: "⭐", tab: "ratings" },
    { label: "Reports", icon: "📈", tab: "reports" },
  ];

  
  const menuItems = role === "admin" ? adminMenuItems : memberMenuItems;

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h2>ClubIQ</h2>
        <button
          type="button"
          className="toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "←" : "→"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.tab}
            type="button"
            className={`nav-item ${activeTab === item.tab ? "active" : ""}`}
            onClick={() => onSelect && onSelect(item.tab)}
          >
            <span className="nav-icon">{item.icon}</span>
            
            {isOpen && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="logout-btn" onClick={onLogout}>
          {isOpen ? "🚪 Logout" : "🚪"}
        </button>
      </div>
    </aside>
  );
}


