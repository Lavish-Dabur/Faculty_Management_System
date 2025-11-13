import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';
import LoadingSpinner from '../../components/LoadingSpinner';
import { subjectsAPI } from '../../services/api';
import BackButton from '../../components/BackButton';

const SubjectsPage = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectsAPI.listSubjects(user?.FacultyID);
        setSubjects(data || []);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };

    if (user?.FacultyID) fetchSubjects();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <BackButton to="/dashboard" />
          <h1 className="text-2xl font-bold">Subjects Taught</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">{error}</div>
        )}

        <div className="flex justify-end mb-4">
          <Link to="/subjects/new" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">+ Add Subject</Link>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No subjects found</p>
            <Link to="/subjects/new" className="text-blue-500 hover:underline mt-2 inline-block">Add your first subject</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map(sub => (
              <div key={sub.SubjectTaughtID} className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold">{sub.SubjectName}</h3>
                <p className="text-sm text-gray-600 mt-1"><strong>Level:</strong> {sub.Level}</p>
                <div className="mt-4 flex gap-2">
                  <Link to={`/subjects/edit/${sub.SubjectTaughtID}`} className="text-indigo-600 hover:underline">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsPage;
