import React, { useContext } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthContext } from './AuthContext';

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className='App'>
      <h1>Club IQ</h1>
      {isLoggedIn ? <Dashboard /> : <Login />}  
    </div>
  );
}

export default App;
