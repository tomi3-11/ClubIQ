import ActivityCard from "../ActivityCard";
import RatingCard from "../RatingCard";

export default function Overview() {
  const activities = [
    {
      id: 1,
      title: "Tech Fair Organization",
      status: "Completed",
      rating: 4.5,
      date: "2024-10-15",
    },
    {
      id: 2,
      title: "Workshop Presentation",
      status: "Pending",
      rating: null,
      date: "2024-11-01",
    },
    {
      id: 3,
      title: "Community Outreach",
      status: "Reviewed",
      rating: 4.0,
      date: "2024-09-20",
    },
  ];

  const ratings = {
    average: 4.2,
    participation: 4,
    teamwork: 4,
    timeliness: 5,
    leadership: 4,
  };

  return (
    <div className='dashboard-content'>
      <div className='stats-grid'>
        <div className='stat-card'>
          <div className='stat-label'>Average Rating</div>
          <div className='stat-value'>{ratings.average}/5</div>
          <div className='stat-bar'>
            <div
              className='stat-fill'
              style={{ width: `${(ratings.average / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className='stat-card'>
          <div className='stat-label'>Activities Completed</div>
          <div className='stat-value'>12</div>
          <div className='stat-subtitle'>3 this month</div>
        </div>

        <div className='stat-card'>
          <div className='stat-label'>Participation Score</div>
          <div className='stat-value'>{ratings.participation}/5</div>
          <div className='stat-subtitle'>Excellent</div>
        </div>

        <div className='stat-card'>
          <div className='stat-label'>Badges Earned</div>
          <div className='stat-value'>5</div>
          <div className='stat-subtitle'>Active Member, Star Volunteer</div>
        </div>
      </div>

      <div className='section'>
        <h2>Recent Activities</h2>
        <div className='activities-list'>
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>

      <div className='section'>
        <h2>Performance Ratings</h2>
        <div className='ratings-grid'>
          <RatingCard label='Participation' value={ratings.participation} />
          <RatingCard label='Teamwork' value={ratings.teamwork} />
          <RatingCard label='Timeliness' value={ratings.timeliness} />
          <RatingCard label='Leadership' value={ratings.leadership} />
        </div>
      </div>
    </div>
  );
}
