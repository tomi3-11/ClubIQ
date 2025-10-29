"use client"

import { useState } from "react"
import "../../styles/admin.css"

export default function RatingPanel() {
  const [selectedMember, setSelectedMember] = useState(null)
  const [ratings, setRatings] = useState({
    participation: 4,
    teamwork: 4,
    timeliness: 5,
    leadership: 3,
  })
  const [feedback, setFeedback] = useState("")

  const handleRatingChange = (criterion, value) => {
    setRatings((prev) => ({ ...prev, [criterion]: value }))
  }

  const handleSubmitRating = () => {
    alert("Rating submitted successfully!")
    setSelectedMember(null)
    setFeedback("")
  }

  return (
    <div className="admin-section">
      <h2>Rate Member Performance</h2>

      {!selectedMember ? (
        <div className="members-list">
          <div className="list-header">Select a member to rate:</div>
          {["Alice Johnson", "Bob Smith", "Carol White"].map((name, idx) => (
            <button key={idx} className="member-item" onClick={() => setSelectedMember(name)}>
              {name}
            </button>
          ))}
        </div>
      ) : (
        <div className="rating-form">
          <button className="back-btn" onClick={() => setSelectedMember(null)}>
            ← Back
          </button>
          <h3>Rating for {selectedMember}</h3>

          <div className="rating-criteria">
            {Object.entries(ratings).map(([criterion, value]) => (
              <div key={criterion} className="criterion">
                <label>{criterion.charAt(0).toUpperCase() + criterion.slice(1)}</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star ${star <= value ? "active" : ""}`}
                      onClick={() => handleRatingChange(criterion, star)}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Feedback Comments</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add optional feedback..."
              rows="4"
            ></textarea>
          </div>

          <button className="btn btn-primary" onClick={handleSubmitRating}>
            Submit Rating
          </button>
        </div>
      )}
    </div>
  )
}
