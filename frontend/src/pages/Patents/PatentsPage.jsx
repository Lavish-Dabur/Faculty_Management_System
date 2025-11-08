import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../store/auth.store';
import LoadingSpinner from '../../components/LoadingSpinner';
import PrimaryButton from '../../components/PrimaryButton';

const PatentsPage = () => {
  const { user } = useAuth();
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatents = async () => {
      try {
        const response = await axios.get(`/api/faculty/patents/${user?.FacultyID}`);
        setPatents(response.data);
      } catch (error) {
        console.error('Error fetching patents:', error);
        setError('Failed to load patents');
      } finally {
        setLoading(false);
      }
    };

    if (user?.FacultyID) {
      fetchPatents();
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patents</h1>
        <Link to="/patents/new">
          <PrimaryButton>Add Patent</PrimaryButton>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {patents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No patents found</p>
          <Link to="/patents/new" className="text-blue-500 hover:underline mt-2 inline-block">
            Add your first patent
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {patents.map((patent) => (
            <PatentCard key={patent.PatentID} patent={patent} />
          ))}
        </div>
      )}
    </div>
  );
};

const PatentCard = ({ patent }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPatentStatus = (filingDate, publicationDate) => {
    if (!publicationDate) return 'Pending';
    return 'Granted';
  };

  const status = getPatentStatus(patent.FilingDate, patent.PublicationDate);
  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Granted': 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{patent.Title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
              {status}
            </span>
          </div>
          
          <p className="text-gray-500 text-sm mt-1">
            Patent Number: {patent.PatentNumber}
          </p>
          
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Filing Date:</span> {formatDate(patent.FilingDate)}
            </p>
            {patent.PublicationDate && (
              <p className="text-sm">
                <span className="text-gray-600">Publication Date:</span> {formatDate(patent.PublicationDate)}
              </p>
            )}
            {patent.Authority && (
              <p className="text-sm">
                <span className="text-gray-600">Authority:</span> {patent.Authority}
              </p>
            )}
            {patent.CollaborationInstitute && (
              <p className="text-sm">
                <span className="text-gray-600">Collaboration:</span> {patent.CollaborationInstitute}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link 
            to={`/patents/edit/${patent.PatentID}`}
            className="text-blue-500 hover:text-blue-600"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatentsPage;