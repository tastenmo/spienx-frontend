import React, { useState, useEffect } from 'react';
import { userProfileService } from '../services/userProfileService';
import type { UserResponse, UserProfileResponse } from '../proto/accounts';

/**
 * Example component showing how to use the User and UserProfile gRPC API
 */
export const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load user and profile data
      const [userData, profileData] = await Promise.all([
        userProfileService.getCurrentUser(),
        userProfileService.getCurrentUserProfile(),
      ]);

      setUser(userData);
      setProfile(profileData);

      // Initialize form fields
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setEmail(userData.email || '');
      setBio(profileData.bio || '');
      setAvatarUrl(profileData.avatarUrl || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const updatedUser = await userProfileService.updateCurrentUser({
        firstName,
        lastName,
        email,
      });
      setUser(updatedUser);
      alert('User information updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const updatedProfile = await userProfileService.updateCurrentUserProfile({
        bio,
        avatarUrl,
      });
      setProfile(updatedProfile);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>User Profile</h1>

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#ffcccc', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      {user && (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
          <h2>Current User Information</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email || 'Not set'}</p>
          <p><strong>First Name:</strong> {user.firstName || 'Not set'}</p>
          <p><strong>Last Name:</strong> {user.lastName || 'Not set'}</p>
        </div>
      )}

      {profile && (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
          <h2>Current Profile Information</h2>
          <p><strong>Bio:</strong> {profile.bio || 'Not set'}</p>
          <p><strong>Avatar URL:</strong> {profile.avatarUrl || 'Not set'}</p>
          <p><strong>Active:</strong> {profile.isActive ? 'Yes' : 'No'}</p>
        </div>
      )}

      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <h2>Update User Information</h2>
        <form onSubmit={handleUpdateUser}>
          <div style={{ marginBottom: '10px' }}>
            <label>
              First Name:
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Last Name:
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
              />
            </label>
          </div>
          <button type="submit" style={{ padding: '10px 20px' }}>
            Update User
          </button>
        </form>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <h2>Update Profile</h2>
        <form onSubmit={handleUpdateProfile}>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Bio:
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px', width: '300px', height: '100px' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Avatar URL:
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
              />
            </label>
          </div>
          <button type="submit" style={{ padding: '10px 20px' }}>
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};
