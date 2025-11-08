import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';
import axios from '../../utils/axios';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';

const AddPatentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [patent, setPatent] = useState({
    Title: '',
    PatentNumber: '',
    FilingDate: '',
    PublicationDate: '',
    Authority: '',
    CollaborationInstitute: '',
    TypeID: 'patent', // Default type for patents
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatent(prev => ({
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
        ...patent,
        PublicationDate: patent.PublicationDate || null,
      };

      await axios.post(`/api/faculty/patents/${user.FacultyID}`, formData);
      navigate('/patents');
    } catch (error) {
      console.error('Error adding patent:', error);
      setError(error.response?.data?.message || 'Failed to add patent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Patent</h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <FormInput
              label="Patent Title"
              name="Title"
              value={patent.Title}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Patent Number"
              name="PatentNumber"
              value={patent.PatentNumber}
              onChange={handleInputChange}
              required
            />

            <FormInput
              type="date"
              label="Filing Date"
              name="FilingDate"
              value={patent.FilingDate}
              onChange={handleInputChange}
              required
            />

            <FormInput
              type="date"
              label="Publication Date"
              name="PublicationDate"
              value={patent.PublicationDate}
              onChange={handleInputChange}
              helperText="Leave empty if patent is pending"
            />

            <FormInput
              label="Authority"
              name="Authority"
              value={patent.Authority}
              onChange={handleInputChange}
              placeholder="e.g., Indian Patent Office"
            />

            <FormInput
              label="Collaborating Institute"
              name="CollaborationInstitute"
              value={patent.CollaborationInstitute}
              onChange={handleInputChange}
              placeholder="Leave empty if not applicable"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/patents')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <PrimaryButton
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Patent'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatentPage;