import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthContext, AuthProvider } from './AuthContext';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import Register from './components/Register';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/" />
};

function App() {
  // const { isLoggedIn } = useContext(AuthContext);

  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          <h1>Club IQ</h1>
          <Routes>
            {/* {isLoggedIn ? <Dashboard /> : <Login />}   */}
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/forgot_password" element={<ForgotPasswordForm />} />
            <Route path="/reset_password/:token" element={<ResetPasswordForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Login />;
};

export default App;
