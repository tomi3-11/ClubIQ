"use client";

import { useState } from "react";
import "../styles/sidebar.css";
import {
  LayoutDashboard,
  ListChecks,
  User,
  CheckSquare,
  Users,
  BarChart3
} from "lucide-react";


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
  { label: "Dashboard", icon: <LayoutDashboard/>, tab: "overview" },
  { label: "My Activities", icon: <ListChecks/>, tab: "activities" },
  // { label: "My Ratings", icon: Star, tab: "ratings" },
  { label: "Profile", icon: <User/>, tab: "profile" },
  { label: "My Tasks", icon: <CheckSquare/>, tab: "tasks" },
];

const adminMenuItems = [
  { label: "Dashboard", icon: <LayoutDashboard/>, tab: "overview" },
  { label: "Members", icon: <Users/>, tab: "members" },
  { label: "Activities", icon: <ListChecks/>, tab: "activities" },
  // { label: "Ratings", icon: Star, tab: "ratings" },
  { label: "Reports", icon: <BarChart3/>, tab: "reports" },
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


