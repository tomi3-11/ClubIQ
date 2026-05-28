import ActivityCard from "../reusables/ActivityCard";

export default function Activities() {
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

  return (
    <div className='dashboard-content'>
      <div className='section'>
        <h2>My Activities</h2>
        <div className='activities-list'>
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}
