import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MemberEditForm from './MemberEditForm';


function MemberList({ onListUpdated, isAdmin }) {
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState('');
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('/api/members', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMembers(response.data);
      } catch (error) {
        setMessage('Failed to fetch members. Please log in again.');
        console.error('Fetch members error:', error.response.data);
      }
    };

    fetchMembers();
  }, [onListUpdated]);

  // Placeholder functions for the buttons
  const handleEdit = (member) => {
    setEditingMember(member);
  }

  const handleDelete = async (memberId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this member?");
    if (confirmDelete) {
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`/api/members/${memberId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Filtering out the deleted members
            onListUpdated();
            setMembers(members.filter(member => member.id !== memberId));
            setMessage('Member deleted successfully!');
        } catch (error) {
            setMessage('Failed to delete member.');
            console.error('Delete member error:', error.response.data)
        }
    }
  }

  const handleMemberUpdated = () => {
      setEditingMember(null); // Hide the form 
      onListUpdated();
  }

  return (
    <div>
      <h2>Members</h2>
      {message && <p>{message}</p>}
      <ul>
        {members.length > 0 ? (
          members.map(member => (
            <li key={member.id}>
                {member.name} ({member.email}) - {member.role}
                {isAdmin && (
                    <>
                        <button onClick={() => handleEdit(member)}>Edit</button>
                        <button onClick={() => handleDelete(member.id)}>Delete</button>
                    </>

                )}
        </li>
          ))
        ) : (
          <p>No members found.</p>
        )}
      </ul>

      {editingMember && isAdmin && (
        <MemberEditForm
            member={editingMember}
            onMemberUpdated={handleMemberUpdated}
            onCancel={() => setEditingMember(null)}
        />
      )}

    </div>
  );
  }

export default MemberList;