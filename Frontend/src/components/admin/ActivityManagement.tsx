"use client"

import { useState } from "react"
import "../../styles/admin.css"

export default function ActivityManagement() {
  const [activities] = useState([
    { id: 1, title: "Tech Fair", deadline: "2024-11-15", assignedTo: "Tech Club", status: "Active" },
    { id: 2, title: "Workshop", deadline: "2024-11-20", assignedTo: "Tech Club", status: "Active" },
    { id: 3, title: "Community Outreach", deadline: "2024-10-30", assignedTo: "All Clubs", status: "Completed" },
  ])

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Activity Management</h2>
        <button className="btn btn-primary">+ Create Activity</button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Activity Title</th>
              <th>Deadline</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.title}</td>
                <td>{activity.deadline}</td>
                <td>{activity.assignedTo}</td>
                <td>
                  <span className="status-badge">{activity.status}</span>
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
