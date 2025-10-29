"use client"

import { useState } from "react"
import "../../styles/admin.css"

export default function MemberManagement() {
  const [members] = useState([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", club: "Tech Club", rating: 4.5, status: "Active" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", club: "Tech Club", rating: 4.0, status: "Active" },
    { id: 3, name: "Carol White", email: "carol@example.com", club: "Art Club", rating: 3.8, status: "Active" },
    { id: 4, name: "David Brown", email: "david@example.com", club: "Sports Club", rating: 4.2, status: "Inactive" },
  ])

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Member Management</h2>
        <button className="btn btn-primary">+ Add Member</button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Club</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.club}</td>
                <td>⭐ {member.rating}</td>
                <td>
                  <span className="status-badge">{member.status}</span>
                </td>
                <td>
                  <button className="action-btn">Edit</button>
                  <button className="action-btn delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
