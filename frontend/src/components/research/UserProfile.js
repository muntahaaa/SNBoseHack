import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>{user.name}'s Profile</h2>
        <p className="role-badge">{user.role}</p>
      </div>

      <div className="profile-section">
        <h3>Profile Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Email</label>
            <p>{user.email}</p>
          </div>
          <div className="info-item">
            <label>Member Since</label>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {user.role === 'researcher' && (
        <div className="profile-section">
          <h3>Research Activities</h3>
          <div className="activity-stats">
            <div className="stat-item">
              <span className="stat-value">{user.posts?.length || 0}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.challenges?.length || 0}</span>
              <span className="stat-label">Challenges</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;