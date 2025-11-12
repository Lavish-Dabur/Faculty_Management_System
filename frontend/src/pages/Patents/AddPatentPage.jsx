import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';
import axios from '../../utils/axios';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';

const AddPatentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
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

  useEffect(() => {
    if (isEditMode) {
      fetchPatentData();
    }
  }, [id]);

  const fetchPatentData = async () => {
    try {
      const response = await axios.get(`/faculty/patents/single/${id}`);
      const patent = response.data;
      setPatent({
        Title: data.Title || '',
        PatentNumber: data.PatentNumber || '',
        FilingDate: data.FilingDate ? data.FilingDate.split('T')[0] : '',
        PublicationDate: data.PublicationDate ? data.PublicationDate.split('T')[0] : '',
        Authority: data.Authority || '',
        CollaborationInstitute: data.CollaborationInstitute || '',
        TypeID: data.TypeID || 'patent',
      });
    } catch (err) {
      setError('Failed to fetch patent data');
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

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

      if (isEditMode) {
        await axios.put(`/faculty/patents/${id}`, formData);
      } else {
        await axios.post(`/faculty/patents/${user.FacultyID}`, formData);
      }
      navigate('/patents');
    } catch (error) {
      console.error('Error saving patent:', error);
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} patent`);
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
          <BackButton to="/patents" />
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Patent' : 'Add New Patent'}
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
              {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Patent' : 'Save Patent')}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatentPage;