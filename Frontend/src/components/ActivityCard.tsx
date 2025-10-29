import "../styles/components.css";

interface Activity {
  id: number;
  title: string;
  status: string;
  rating: number | null;
  date: string;
}
export default function ActivityCard({ activity }: { activity: Activity }) {
  const getStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "Completed":
        return "#10b981";
      case "Pending":
        return "#f59e0b";
      case "Reviewed":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className='activity-card'>
      <div className='activity-header'>
        <h3>{activity.title}</h3>
        <span
          className='status-badge'
          style={{ backgroundColor: getStatusColor(activity.status) }}
        >
          {activity.status}
        </span>
      </div>
      <div className='activity-meta'>
        <span className='date'>{activity.date}</span>
        {activity.rating && (
          <span className='rating'>⭐ {activity.rating}/5</span>
        )}
      </div>
    </div>
  );
}
