import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';

const OutreachActivitiesPage = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const facultyId = JSON.parse(localStorage.getItem('user')).FacultyID;
            const response = await axios.get(`/faculty/outreach/${facultyId}`);
            setActivities(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch outreach activities');
            setLoading(false);
        }
    };

    const handleDelete = async (activityId) => {
        if (window.confirm('Are you sure you want to delete this outreach activity?')) {
            try {
                await axios.delete(`/faculty/outreach/${activityId}`);
                setActivities(activities.filter(activity => activity.ActivityID !== activityId));
            } catch (err) {
                setError('Failed to delete outreach activity');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <BackButton to="/dashboard" />
                    <h1 className="text-2xl font-bold text-gray-800">Outreach Activities</h1>
                </div>
                <PrimaryButton
                    onClick={() => navigate('/outreach/new')}
                    className="px-4 py-2"
                >
                    Add New Activity
                </PrimaryButton>
            </div>

            {activities.length === 0 ? (
                <p className="text-gray-600 text-center">No outreach activities found. Add your first activity!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activities.map((activity) => (
                        <div key={activity.ActivityID} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-semibold mb-2">{activity.ActivityTitle}</h3>
                            <p className="text-gray-600 mb-1">
                                <span className="font-medium">Type:</span> {activity.ActivityType}
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-medium">Institution:</span> {activity.InstitutionName || 'N/A'}
                            </p>
                            <p className="text-gray-600 mb-1">
                                <span className="font-medium">Date:</span> {formatDate(activity.ActivityDate)}
                            </p>
                            {activity.Description && (
                                <p className="text-gray-600 mb-4">
                                    <span className="font-medium">Description:</span><br />
                                    {activity.Description}
                                </p>
                            )}
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={() => navigate(`/outreach/edit/${activity.ActivityID}`)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(activity.ActivityID)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OutreachActivitiesPage;