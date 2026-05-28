export default function Overview() {
  return (
    <div className='admin-overview'>
      <div className='stats-grid'>
        <div className='stat-card'>
          <div className='stat-label'>Total Members</div>
          <div className='stat-value'>48</div>
        </div>
        <div className='stat-card'>
          <div className='stat-label'>Active Activities</div>
          <div className='stat-value'>12</div>
        </div>
        <div className='stat-card'>
          <div className='stat-label'>Avg Rating</div>
          <div className='stat-value'>4.1/5</div>
        </div>
        <div className='stat-card'>
          <div className='stat-label'>Completion Rate</div>
          <div className='stat-value'>87%</div>
        </div>
      </div>
    </div>
  );
}
