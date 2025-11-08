import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';
import axios from '../../utils/axios';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';

const AddResearchProjectPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [project, setProject] = useState({
    Title: '',
    StartDate: '',
    EndDate: '',
    FundingAgency: '',
    Budget: '',
    TypeID: 'research_project', // Default type for research projects
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({
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
        ...project,
        Budget: project.Budget ? parseFloat(project.Budget) : null,
        EndDate: project.EndDate || null,
      };

      await axios.post(`/api/faculty/research/${user.FacultyID}`, formData);
      navigate('/research');
    } catch (error) {
      console.error('Error adding research project:', error);
      setError(error.response?.data?.message || 'Failed to add research project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Research Project</h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <FormInput
              label="Project Title"
              name="Title"
              value={project.Title}
              onChange={handleInputChange}
              required
            />

            <FormInput
              type="date"
              label="Start Date"
              name="StartDate"
              value={project.StartDate}
              onChange={handleInputChange}
              required
            />

            <FormInput
              type="date"
              label="End Date"
              name="EndDate"
              value={project.EndDate}
              onChange={handleInputChange}
              helperText="Leave empty if project is ongoing"
            />

            <FormInput
              label="Funding Agency"
              name="FundingAgency"
              value={project.FundingAgency}
              onChange={handleInputChange}
            />

            <FormInput
              type="number"
              label="Budget (INR)"
              name="Budget"
              value={project.Budget}
              onChange={handleInputChange}
              min="0"
              step="1000"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/research')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <PrimaryButton
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Project'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResearchProjectPage;