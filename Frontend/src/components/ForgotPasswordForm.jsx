import { useState } from "react"
import axios from "axios"


function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null); // 'success' or 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setStatus(null);

        try {
            await axios.post('/api/reset_request', {email});
            setMessage('A password reset link has been sent to your email.');
            setStatus('success');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to send password reset link. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div>
            <h2>Forgot Password?</h2>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p className={status}>{message}</p>}
        </div>
    );
}

export default ForgotPasswordForm;