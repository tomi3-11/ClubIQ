"use client";

import { useState } from "react";
import "../styles/sidebar.css";

export default function Sidebar({
  role,
  onLogout,
}: {
  role: "admin" | "member";
  onLogout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const memberMenuItems = [
    { label: "Dashboard", icon: "📊" },
    { label: "My Activities", icon: "📋" },
    { label: "My Ratings", icon: "⭐" },
    { label: "Profile", icon: "👤" },
  ];

  const adminMenuItems = [
    { label: "Dashboard", icon: "📊" },
    { label: "Members", icon: "👥" },
    { label: "Activities", icon: "📋" },
    { label: "Ratings", icon: "⭐" },
    { label: "Reports", icon: "📈" },
  ];

  const menuItems = role === "admin" ? adminMenuItems : memberMenuItems;

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className='sidebar-header'>
        <h2>ClubIQ</h2>
        <button className='toggle-btn' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "←" : "→"}
        </button>
      </div>

      <nav className='sidebar-nav'>
        {menuItems.map((item, idx) => (
          <a key={idx} href='#' className='nav-item'>
            <span className='nav-icon'>{item.icon}</span>
            {isOpen && <span className='nav-label'>{item.label}</span>}
          </a>
        ))}
      </nav>

      <div className='sidebar-footer'>
        <button className='logout-btn' onClick={onLogout}>
          {isOpen ? "🚪 Logout" : "🚪"}
        </button>
      </div>
    </aside>
  );
}
