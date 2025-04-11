import React from 'react';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="user-profile">
        <span className="profile-name">Guest</span>
      </div>
    );
  }

  return (
    <div className="user-profile">
      {user.avatar ? (
        <img src={user.avatar} alt={user.username} className="profile-avatar" />
      ) : (
        <div className="profile-avatar-placeholder">👤</div>
      )}

      <div className="profile-info">
        <span className="profile-name">{user.username}</span>
        <span className="profile-email">{user.email}</span>
      </div>

      <button onClick={logout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}
