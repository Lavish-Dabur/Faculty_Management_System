import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/auth.store';
import axios from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/faculty/profile/${user?.FacultyID}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.FacultyID) {
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(`/api/faculty/profile/${user?.FacultyID}`, profile);
      updateUser(response.data);
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Profile Information</h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-500 p-4 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="First Name"
              name="FirstName"
              value={profile?.FirstName || ''}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Last Name"
              name="LastName"
              value={profile?.LastName || ''}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Email"
              type="email"
              name="Email"
              value={profile?.Email || ''}
              onChange={handleInputChange}
              required
              disabled
            />

            <FormInput
              label="Phone Number"
              name="Phone_no"
              value={profile?.Phone_no || ''}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Gender"
              name="Gender"
              value={profile?.Gender || ''}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Date of Birth"
              type="date"
              name="DOB"
              value={profile?.DOB ? new Date(profile.DOB).toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Role"
              name="Role"
              value={profile?.Role || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setProfile(user)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Reset
            </button>
            <PrimaryButton
              type="submit"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage; 