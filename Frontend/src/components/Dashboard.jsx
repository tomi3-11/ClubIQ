import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import MemberList from './MemberList';
import MemberForm from './MemberForm';

function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
  };

  const handleListUpdate = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div>
      <h2>Welcome to the Dashboard!</h2>
      <p>You are logged in.</p>
      <button onClick={handleLogout}>Logout</button>
      <MemberForm onMemberAdded={handleListUpdate}/>
      <MemberList key={refreshKey} onListUpdated={handleListUpdate} />
    </div>
  );
}

export default Dashboard;