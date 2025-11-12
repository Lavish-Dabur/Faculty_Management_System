import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';
import axios from '../../utils/axios';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';

const AddPublicationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [publicationType, setPublicationType] = useState('journal');

  const [publication, setPublication] = useState({
    Title: '',
    PublicationYear: new Date().toISOString().split('T')[0],
    FundingAgency: '',
    TypeID: '',
    // Journal specific
    JournalName: '',
    VolumeNumber: '',
    IssueNumber: '',
    ISSN_Number: '',
    // Conference specific
    ConferencePublisher: '',
    ConferenceLocation: '',
    PageNumbers: '',
    // Book specific
    BookPublisher: '',
    Edition: '',
    ISBN_Number: '',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchPublicationData();
    }
  }, [id]);

  const fetchPublicationData = async () => {
    try {
      const response = await axios.get(`/faculty/publication/single/${id}`);
      const data = response.data;
      setPublication({
        Title: data.Title || '',
        PublicationYear: data.PublicationYear ? new Date(data.PublicationYear).toISOString().split('T')[0] : '',
        FundingAgency: data.FundingAgency || '',
        TypeID: data.TypeID || '',
        JournalName: data.JournalPublicationDetails?.Name || '',
        VolumeNumber: data.JournalPublicationDetails?.VolumeNumber || '',
        IssueNumber: data.JournalPublicationDetails?.IssueNumber || '',
        ISSN_Number: data.JournalPublicationDetails?.ISSN_Number || '',
        ConferencePublisher: data.ConferencePaperDetails?.Publisher || '',
        ConferenceLocation: data.ConferencePaperDetails?.Location || '',
        PageNumbers: data.ConferencePaperDetails?.PageNumbers || '',
        BookPublisher: data.BookPublicationDetails?.Publisher || '',
        Edition: data.BookPublicationDetails?.Edition || '',
        ISBN_Number: data.BookPublicationDetails?.ISBN_Number || '',
      });
      if (data.TypeID) setPublicationType(data.TypeID);
    } catch (err) {
      setError('Failed to fetch publication data');
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPublication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Transform data based on publication type
      const formData = {
        Title: publication.Title,
        PublicationYear: new Date(publication.PublicationYear),
        FundingAgency: publication.FundingAgency || null,
        TypeID: publicationType,
      };

      // Add type-specific details
      if (publicationType === 'journal') {
        formData.JournalPublicationDetails = {
          Name: publication.JournalName,
          VolumeNumber: publication.VolumeNumber,
          IssueNumber: publication.IssueNumber,
          ISSN_Number: parseInt(publication.ISSN_Number) || null
        };
      } else if (publicationType === 'conference') {
        formData.ConferencePaperDetails = {
          Publisher: publication.ConferencePublisher,
          Location: publication.ConferenceLocation,
          PageNumbers: publication.PageNumbers
        };
      } else if (publicationType === 'book') {
        formData.BookPublicationDetails = {
          Publisher: publication.BookPublisher,
          Edition: publication.Edition,
          ISBN_Number: publication.ISBN_Number
        };
      }

      if (isEditMode) {
        await axios.put(`/faculty/publication/${id}`, formData);
      } else {
        await axios.post(`/faculty/publication/${user.FacultyID}`, formData);
      }
      navigate('/publications');
    } catch (error) {
      console.error('Error saving publication:', error);
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} publication`);
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
          <BackButton to="/publications" />
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Publication' : 'Add New Publication'}
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
              label="Publication Title"
              name="Title"
              value={publication.Title}
              onChange={handleInputChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publication Type
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={publicationType}
                onChange={(e) => setPublicationType(e.target.value)}
              >
                <option value="journal">Journal Article</option>
                <option value="conference">Conference Paper</option>
                <option value="book">Book</option>
              </select>
            </div>

            <FormInput
              type="date"
              label="Publication Year"
              name="PublicationYear"
              value={publication.PublicationYear}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Funding Agency"
              name="FundingAgency"
              value={publication.FundingAgency}
              onChange={handleInputChange}
            />

            {/* Type-specific fields */}
            {publicationType === 'journal' && (
              <>
                <FormInput
                  label="Journal Name"
                  name="JournalName"
                  value={publication.JournalName}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label="Volume Number"
                  name="VolumeNumber"
                  value={publication.VolumeNumber}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Issue Number"
                  name="IssueNumber"
                  value={publication.IssueNumber}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="ISSN Number"
                  name="ISSN_Number"
                  value={publication.ISSN_Number}
                  onChange={handleInputChange}
                />
              </>
            )}

            {publicationType === 'conference' && (
              <>
                <FormInput
                  label="Publisher"
                  name="ConferencePublisher"
                  value={publication.ConferencePublisher}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label="Location"
                  name="ConferenceLocation"
                  value={publication.ConferenceLocation}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Page Numbers"
                  name="PageNumbers"
                  value={publication.PageNumbers}
                  onChange={handleInputChange}
                />
              </>
            )}

            {publicationType === 'book' && (
              <>
                <FormInput
                  label="Publisher"
                  name="BookPublisher"
                  value={publication.BookPublisher}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  label="Edition"
                  name="Edition"
                  value={publication.Edition}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="ISBN Number"
                  name="ISBN_Number"
                  value={publication.ISBN_Number}
                  onChange={handleInputChange}
                />
              </>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/publications')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <PrimaryButton
              type="submit"
              disabled={loading}
            >
              {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Publication' : 'Save Publication')}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPublicationPage;