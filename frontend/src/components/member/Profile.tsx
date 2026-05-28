export default function Profile() {
  return (
    <div className='dashboard-content'>
      <div className='profile-section'>
        <h2>Profile Settings</h2>
        <div className='profile-form'>
          <div className='form-group'>
            <label>Full Name</label>
            <input type='text' defaultValue='Alice Johnson' />
          </div>
          <div className='form-group'>
            <label>Email</label>
            <input type='email' defaultValue='alice@example.com' />
          </div>
          <div className='form-group'>
            <label>Club</label>
            <input type='text' defaultValue='Tech Club' />
          </div>
          <button className='btn btn-primary'>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
