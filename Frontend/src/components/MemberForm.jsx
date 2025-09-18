import React, { useState } from "react";
import axios from "axios";

function MemberForm({ onMemberAdded }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('/api/members', {
                name,
                email,
                role,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setMessage('Member added successfully!');
            setName('');
            setEmail('');
            setRole('member');

            if (onMemberAdded) {
                onMemberAdded(response.data);
            }
        } catch (error) {
            setMessage(error.response.data.message || 'Failed to add member.');
            console.error('Added member error:', error.response.data);
        }
    };

    return (
        <div>
            <h3>Add New Member</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
                </div>

                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>

                <div>
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="member">Member</option>
                        <option value="Admin">Admin</option>
                        {/* <option value="super_user">Super User</option> */}
                    </select>
                </div>

                <button type="submit">Add Member</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default MemberForm;