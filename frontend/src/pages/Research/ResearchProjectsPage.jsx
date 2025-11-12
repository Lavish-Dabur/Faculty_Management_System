import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../store/auth.store';
import LoadingSpinner from '../../components/LoadingSpinner';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';

const ResearchProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`/faculty/research/${user?.FacultyID}`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching research projects:', error);
        setError('Failed to load research projects');
      } finally {
        setLoading(false);
      }
    };

    if (user?.FacultyID) {
      fetchProjects();
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <BackButton to="/dashboard" />
          <h1 className="text-2xl font-bold">Research Projects</h1>
        </div>
        <Link to="/research/new">
          <PrimaryButton>Add Research Project</PrimaryButton>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No research projects found</p>
          <Link to="/research/new" className="text-blue-500 hover:underline mt-2 inline-block">
            Add your first research project
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.ProjectID} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatBudget = (budget) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(budget);
  };

  const getProjectStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (!end) return 'Ongoing';
    if (now < start) return 'Upcoming';
    if (now > end) return 'Completed';
    return 'In Progress';
  };

  const status = getProjectStatus(project.StartDate, project.EndDate);
  const statusColors = {
    'Upcoming': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-green-100 text-green-800',
    'Completed': 'bg-blue-100 text-blue-800',
    'Ongoing': 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{project.Title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
              {status}
            </span>
          </div>
          
          <p className="text-gray-500 text-sm mt-1">
            {formatDate(project.StartDate)} - {project.EndDate ? formatDate(project.EndDate) : 'Present'}
          </p>
          
          {project.FundingAgency && (
            <p className="text-sm mt-2">
              <span className="text-gray-600">Funding Agency:</span> {project.FundingAgency}
            </p>
          )}
          
          {project.Budget && (
            <p className="text-sm mt-1">
              <span className="text-gray-600">Budget:</span> {formatBudget(project.Budget)}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Link 
            to={`/research/edit/${project.ProjectID}`}
            className="text-blue-500 hover:text-blue-600"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResearchProjectsPage;