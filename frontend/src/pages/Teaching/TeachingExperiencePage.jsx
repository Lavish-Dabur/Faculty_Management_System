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
            <ExperienceCard key={experience.ExperienceID} experience={experience} />
          ))}
        </div>
      )}

      {/* Subjects Taught Section */}
      <SubjectsTaughtSection facultyId={user?.FacultyID} />
    </div>
  );
};

const ExperienceCard = ({ experience }) => {
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    }) : 'Present';
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                  end.getMonth() - start.getMonth();
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let duration = '';
    if (years > 0) duration += `${years} year${years > 1 ? 's' : ''}`;
    if (remainingMonths > 0) {
      if (duration) duration += ' ';
      duration += `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
    return duration;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{experience.Designation}</h3>
          <p className="text-gray-600 mt-1">{experience.OrganizationName}</p>
          
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {formatDate(experience.StartDate)} - {formatDate(experience.EndDate)}
              <span className="mx-2">•</span>
              {calculateDuration(experience.StartDate, experience.EndDate)}
            </p>
          </div>

          {experience.NatureOfWork && (
            <p className="text-sm text-gray-600 mt-2">
              {experience.NatureOfWork}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Link 
            to={`/teaching/edit/${experience.ExperienceID}`}
            className="text-blue-500 hover:text-blue-600"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

const SubjectsTaughtSection = ({ facultyId }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`/faculty/subjects/${facultyId}`);
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setError('Failed to load subjects taught');
      } finally {
        setLoading(false);
      }
    };

    if (facultyId) {
      fetchSubjects();
    }
  }, [facultyId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Subjects Taught</h2>
        <Link to="/teaching/subjects/new">
          <PrimaryButton>Add Subject</PrimaryButton>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        {subjects.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No subjects added yet</p>
            <Link to="/teaching/subjects/new" className="text-blue-500 hover:underline mt-2 inline-block">
              Add your first subject
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {subjects.map((subject) => (
              <div key={subject.SubjectTaughtID} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{subject.SubjectName}</h3>
                  <p className="text-sm text-gray-500">Level: {subject.Level}</p>
                </div>
                <Link 
                  to={`/teaching/subjects/edit/${subject.SubjectTaughtID}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachingExperiencePage;