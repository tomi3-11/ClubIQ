import "../../styles/admin.css"

export default function ReportsAnalytics() {
  return (
    <div className="admin-section">
      <h2>Reports & Analytics</h2>

      <div className="reports-grid">
        <div className="report-card">
          <h3>Top Performers</h3>
          <div className="report-content">
            <div className="report-item">
              <span>Alice Johnson</span>
              <span className="rating">4.5/5</span>
            </div>
            <div className="report-item">
              <span>David Brown</span>
              <span className="rating">4.2/5</span>
            </div>
            <div className="report-item">
              <span>Bob Smith</span>
              <span className="rating">4.0/5</span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <h3>Club Performance</h3>
          <div className="report-content">
            <div className="report-item">
              <span>Tech Club</span>
              <span className="rating">4.3/5</span>
            </div>
            <div className="report-item">
              <span>Art Club</span>
              <span className="rating">3.8/5</span>
            </div>
            <div className="report-item">
              <span>Sports Club</span>
              <span className="rating">4.1/5</span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <h3>Activity Completion</h3>
          <div className="report-content">
            <div className="report-stat">
              <div className="stat-label">Completed</div>
              <div className="stat-value">87%</div>
            </div>
            <div className="report-stat">
              <div className="stat-label">In Progress</div>
              <div className="stat-value">10%</div>
            </div>
            <div className="report-stat">
              <div className="stat-label">Pending</div>
              <div className="stat-value">3%</div>
            </div>
          </div>
        </div>

        <div className="report-card">
          <h3>Export Options</h3>
          <div className="report-content">
            <button className="btn btn-secondary">📄 Export to PDF</button>
            <button className="btn btn-secondary">📊 Export to Excel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
