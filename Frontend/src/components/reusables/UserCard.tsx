'use client';

import React from 'react';

type UserCardProps = {
  username: string;
  avatarUrl?: string;
  bio?: string;
};

export default function UserCard({ username, avatarUrl, bio }: UserCardProps) {
  return (
    <div className="user-card" style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      background: '#222',
      borderRadius: '8px',
      marginBottom: '10px',
      gap: '10px'
    }}>
      <img
        src={avatarUrl || '/default-avatar.png'}
        alt={username}
        style={{ width: 40, height: 40, borderRadius: '50%' }}
      />
      <div>
        <strong>{username}</strong>
        {bio && <p style={{ fontSize: '12px', color: '#aaa' }}>{bio}</p>}
      </div>
    </div>
  );
}
