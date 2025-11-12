import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';
import axios from '../../utils/axios';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';

const AddSubjectPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState('');

  const [subject, setSubject] = useState({
    SubjectName: '',
    Level: ''
  });

  useEffect(() => {
    if (isEditMode) {
      fetchSubjectData();
    }
  }, [id]);

  const fetchSubjectData = async () => {
    try {
      const response = await axios.get(`/faculty/subjects/single/${id}`);
      const data = response.data;
      setSubject({
        SubjectName: data.SubjectName || '',
        Level: data.Level || ''
      });
    } catch (err) {
      setError('Failed to fetch subject data');
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await axios.put(`/faculty/subjects/${id}`, subject);
      } else {
        await axios.post(`/faculty/subjects/${user.FacultyID}`, subject);
      }
      navigate('/teaching');
    } catch (error) {
      console.error('Error saving subject:', error);
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} subject`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <BackButton to="/teaching" />
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Subject' : 'Add Subject'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <FormInput
              label="Subject Name"
              name="SubjectName"
              value={subject.SubjectName}
              onChange={handleInputChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                name="Level"
                value={subject.Level}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select Level</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Doctorate">Doctorate</option>
              </select>
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
              {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Subject' : 'Save Subject')}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectPage;