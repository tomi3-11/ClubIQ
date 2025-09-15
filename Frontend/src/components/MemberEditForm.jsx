import React, { useState } from "react";
import axios from "axios";

function MemberEditForm({ member, onMemberUpdated, onCancel }) {
    const [name, setName] = useState(member.name);
    const [email, setEmail] = useState(member.email);
    const [role, setRole] = useState(member.role);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('access_token');
            await axios.put(`/api/members/${member.id}`, {
                name,
                email,
                role
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setMessage('Member updated successfully!');
            onMemberUpdated();

        } catch (error) {
            setMessage(error.response.data.message || 'Failed to update member.');
            console.error('Update member error:', error.response.data);
        }
    };

    return (
        <div>
            <h3>Edit Member</h3>
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
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Update Member</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default MemberEditForm;
