import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import MemberList from './MemberList';
import MemberForm from './MemberForm';
import { jwtDecode } from 'jwt-decode';

function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
  };

  const handleListUpdate = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Get the user's role from the JWT 
  const token = localStorage.getItem('access_token');
  let userRole = null; // This is the default role for every new user
  if (token) {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken.role);
    // Read the role from the role claim in the payload
    userRole = decodedToken.role;
  }

  const isAdmin = userRole === 'admin' || userRole === 'super_user';

  return (
    <div>
      <h2>Welcome to the Dashboard!</h2>
      <p>You are logged in.</p>
      <button onClick={handleLogout}>Logout</button>

      { isAdmin && <MemberForm onMemberAdded={handleListUpdate}/> }
      
      <MemberList key={refreshKey} onListUpdated={handleListUpdate} isAdmin={isAdmin}/>
    </div>
  );
}

export default Dashboard;