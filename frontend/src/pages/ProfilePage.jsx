import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';
import axios from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for user:', user);
        
        if (!user?.FacultyID) {
          console.error('No FacultyID found in user object');
          setError('User not logged in or FacultyID missing');
          setLoading(false);
          return;
        }

        console.log('Making request to:', `/faculty/profile/${user.FacultyID}`);
        const response = await axios.get(`/faculty/profile/${user.FacultyID}`);
        console.log('Profile response:', response.data);
        setProfile(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching profile:', error);
        console.error('Error response:', error.response?.data);
        setError(error.response?.data?.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.FacultyID) {
      fetchProfile();
    } else {
      console.error('User or FacultyID is missing:', user);
      setError('Please login to view your profile');
      setLoading(false);
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
      const response = await axios.put(`/faculty/profile/${user?.FacultyID}`, profile);
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
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate(user?.Role === 'Admin' ? '/admin' : '/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-700"
            title="Back to Dashboard"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Profile Information</h1>
        </div>

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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
              <select
                name="Gender"
                value={profile?.Gender || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

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