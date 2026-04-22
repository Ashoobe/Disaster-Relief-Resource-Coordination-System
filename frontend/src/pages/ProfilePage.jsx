import React from 'react';
import { useAuth } from '../hooks/useAuth';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <div>
        <h1>My Profile</h1>
        <p className="profile-subtitle">View your account details.</p>
      </div>

      <div className="profile-shell">
        <div className="profile-card">
          <h3>Account</h3>
          <div className="profile-grid">
            <div className="profile-field-label">Full Name</div>
            <div>{user?.fullName}</div>
            <div className="profile-field-label">Email</div>
            <div>{user?.email}</div>
            <div className="profile-field-label">Role</div>
            <div className="profile-role-value">{user?.role?.replace('_', ' ')}</div>
          </div>
        </div>

        <div className="profile-card">
          <h3>Security</h3>
          <p className="profile-upgrade-copy">
            Password changes are not exposed by the current backend API.
          </p>
        </div>

        <div className="profile-card">
          <h3>Access Requests</h3>
          <p className="profile-upgrade-copy">
            Role upgrade requests were removed from the frontend because they were stored only in the browser and not in backend storage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
