import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../store/auth.store';
import LoadingSpinner from '../../components/LoadingSpinner';
import PrimaryButton from '../../components/PrimaryButton';

const PublicationsPage = () => {
  const { user } = useAuth();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await axios.get(`/api/faculty/publication/${user?.FacultyID}`);
        setPublications(response.data);
      } catch (error) {
        console.error('Error fetching publications:', error);
        setError('Failed to load publications');
      } finally {
        setLoading(false);
      }
    };

    if (user?.FacultyID) {
      fetchPublications();
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Publications</h1>
        <Link to="/publications/new">
          <PrimaryButton>Add Publication</PrimaryButton>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {publications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No publications found</p>
          <Link to="/publications/new" className="text-blue-500 hover:underline mt-2 inline-block">
            Add your first publication
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {publications.map((pub) => (
            <PublicationCard key={pub.PublicationID} publication={pub} />
          ))}
        </div>
      )}
    </div>
  );
};

const PublicationCard = ({ publication }) => {
  const getPublicationType = (publication) => {
    if (publication.JournalPublicationDetails) return 'Journal Article';
    if (publication.ConferencePaperDetails) return 'Conference Paper';
    if (publication.BookPublicationDetails) return 'Book';
    return 'Publication';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{publication.Title}</h3>
          <p className="text-gray-500 text-sm mt-1">
            {getPublicationType(publication)} • {new Date(publication.PublicationYear).getFullYear()}
          </p>
          {publication.JournalPublicationDetails && (
            <p className="text-sm text-gray-600 mt-2">
              {publication.JournalPublicationDetails.Name} • 
              Volume {publication.JournalPublicationDetails.VolumeNumber} • 
              Issue {publication.JournalPublicationDetails.IssueNumber}
            </p>
          )}
          {publication.ConferencePaperDetails && (
            <p className="text-sm text-gray-600 mt-2">
              {publication.ConferencePaperDetails.Publisher} • 
              {publication.ConferencePaperDetails.Location}
            </p>
          )}
          {publication.BookPublicationDetails && (
            <p className="text-sm text-gray-600 mt-2">
              {publication.BookPublicationDetails.Publisher} • 
              Edition {publication.BookPublicationDetails.Edition}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link 
            to={`/publications/edit/${publication.PublicationID}`}
            className="text-blue-500 hover:text-blue-600"
          >
            Edit
          </Link>
        </div>
      </div>
      
      {publication.FundingAgency && (
        <p className="text-sm text-gray-500 mt-4">
          Funded by: {publication.FundingAgency}
        </p>
      )}
    </div>
  );
};

export default PublicationsPage;