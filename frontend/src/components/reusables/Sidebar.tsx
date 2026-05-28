"use client";

import { useState } from "react";
import "../../styles/sidebar.css";
import {
  LayoutDashboard,
  ListChecks,
  User,
  CheckSquare,
  Users,
  BarChart3,
  Star,
  LogOut,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import useSignOut from "@/hooks/useSignOut";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

type SidebarProps = {
  role?: "admin" | "member";
};

export default function Sidebar({ role }: SidebarProps) {
  const { NavOpen, setNavOpen } = useAppContext();
  const { handleSignOut } = useSignOut();
  const pathname = usePathname();

  const memberMenuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard />,
      tab: "overview",
      href: "/member/dashboard",
    },
    {
      label: "My Activities",
      icon: <ListChecks />,
      tab: "activities",
      href: "/member/activities",
    },
    {
      label: "My Ratings",
      icon: <Star />,
      tab: "ratings",
      href: "/member/ratings",
    },
    {
      label: "Profile",
      icon: <User />,
      tab: "profile",
      href: "/member/profile",
    },
    {
      label: "My Tasks",
      icon: <CheckSquare />,
      tab: "tasks",
      href: "/member/tasks",
    },
  ];

  const adminMenuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard />,
      tab: "overview",
      href: "/admin/dashboard",
    },
    {
      label: "Members",
      icon: <Users />,
      tab: "members",
      href: "/admin/members",
    },
    {
      label: "Activities",
      icon: <ListChecks />,
      tab: "activities",
      href: "/admin/activities",
    },
    {
      label: "Ratings",
      icon: <Star />,
      tab: "ratings",
      href: "/admin/ratings",
    },
    {
      label: "Reports",
      icon: <BarChart3 />,
      tab: "reports",
      href: "/admin/reports",
    },
    {
      label: "Profile",
      icon: <User />,
      tab: "profile",
      href: "/admin/profile",
    },
  ];

  const menuItems = role === "admin" ? adminMenuItems : memberMenuItems;

  return (
    <aside className={`sidebar ${NavOpen ? "open" : "closed"}`}>
      <div className='sidebar-header'>
        <h2 className={`text-white ${NavOpen ? "" : "hidden"}`}>ClubIQ</h2>
        <button
          type='button'
          className='toggle-btn'
          onClick={() => setNavOpen(!NavOpen)}
        >
          {NavOpen ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
        </button>
      </div>

      <nav className='sidebar-nav'>
        {menuItems.map((item) => (
          <Link
            href={item.href}
            key={item.tab}
            className={`nav-item ${
              pathname.includes(item.href) ? "active" : ""
            } whitespace-nowrap`}
          >
            <span className='nav-icon'>{item.icon}</span>

            {NavOpen && <span className='nav-label'>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className='sidebar-footer'>
        <button type='button' className='logout-btn' onClick={handleSignOut}>
          {NavOpen ? (
            <div className='flex gap-1'>
              <LogOut color='white' />
              <span>Logout</span>
            </div>
          ) : (
            <LogOut color='white' />
          )}
        </button>
      </div>
    </aside>
  );
}
