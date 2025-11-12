import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../store/auth.store';
import LoadingSpinner from '../../components/LoadingSpinner';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';

const TeachingExperiencePage = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get(`/faculty/teaching/${user?.FacultyID}`);
        setExperiences(response.data);
      } catch (error) {
        console.error('Error fetching teaching experiences:', error);
        setError('Failed to load teaching experiences');
      } finally {
        setLoading(false);
      }
    };

    if (user?.FacultyID) {
      fetchExperiences();
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <BackButton to="/dashboard" />
          <h1 className="text-2xl font-bold">Teaching Experience</h1>
        </div>
        <Link to="/teaching/new">
          <PrimaryButton>Add Teaching Experience</PrimaryButton>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {experiences.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No teaching experience records found</p>
          <Link to="/teaching/new" className="text-blue-500 hover:underline mt-2 inline-block">
            Add your first teaching experience
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.SubjectTaughtID} experience={experience} />
          ))}
        </div>
      )}
    </div>
  );
};

const ExperienceCard = ({ experience }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{experience.SubjectName}</h3>
          <div className="mt-2 space-y-1">
            <p className="text-gray-600">
              <span className="font-medium">Level:</span> {experience.Level}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Academic Year:</span> {experience.AcademicYear}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Semester:</span> {experience.Semester}
            </p>
            {experience.SubjectCode && (
              <p className="text-gray-600">
                <span className="font-medium">Subject Code:</span> {experience.SubjectCode}
              </p>
            )}
            {experience.Credits && (
              <p className="text-gray-600">
                <span className="font-medium">Credits:</span> {experience.Credits}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link 
            to={`/teaching/edit/${experience.SubjectTaughtID}`}
            className="text-blue-500 hover:text-blue-600"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeachingExperiencePage;