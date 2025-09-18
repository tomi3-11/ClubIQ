import React, {useState} from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPasswordForm() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null); // 'success' or 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setStatus(null);

        if (password !== confirmPassword) {
            setMessage('Password do not match.');
            setStatus('error');
            return;
        }

        try {
            const res = await axios.post(`/api/reset_password/${token}`, {
                new_password: password,
            });

            setMessage(res.data.message || 'Password has been reset successfully. Redirecting to login...');
            setStatus('success');
            
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.');
            setStatus('error');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required    
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required 
                        />
                </div>
                <button type='submit'>Reset Password</button>
            </form>
            {message && <p className={status}>{message}</p>}
        </div>
    );
}

export default ResetPasswordForm;