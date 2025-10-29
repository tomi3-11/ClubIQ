import "../styles/components.css"

export default function RatingCard({ label, value }) {
  const percentage = (value / 5) * 100

  return (
    <div className="rating-card">
      <div className="rating-label">{label}</div>
      <div className="rating-value">{value}/5</div>
      <div className="rating-bar">
        <div className="rating-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}
