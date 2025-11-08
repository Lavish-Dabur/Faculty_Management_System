import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';
import axios from '../../utils/axios';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';

const AddTeachingExperiencePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [experience, setExperience] = useState({
    OrganizationName: '',
    Designation: '',
    StartDate: '',
    EndDate: '',
    NatureOfWork: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExperience(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = {
        ...experience,
        EndDate: experience.EndDate || null,
      };

      await axios.post(`/api/faculty/teaching/${user.FacultyID}`, formData);
      navigate('/teaching');
    } catch (error) {
      console.error('Error adding teaching experience:', error);
      setError(error.response?.data?.message || 'Failed to add teaching experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Add Teaching Experience</h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <FormInput
              label="Organization Name"
              name="OrganizationName"
              value={experience.OrganizationName}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Designation"
              name="Designation"
              value={experience.Designation}
              onChange={handleInputChange}
              required
            />

            <FormInput
              type="date"
              label="Start Date"
              name="StartDate"
              value={experience.StartDate}
              onChange={handleInputChange}
              required
            />

            <FormInput
              type="date"
              label="End Date"
              name="EndDate"
              value={experience.EndDate}
              onChange={handleInputChange}
              helperText="Leave empty if this is your current position"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nature of Work
              </label>
              <textarea
                name="NatureOfWork"
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe your responsibilities and achievements..."
                value={experience.NatureOfWork}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/teaching')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <PrimaryButton
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Experience'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeachingExperiencePage;