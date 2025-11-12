import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';

const QualificationsPage = () => {
    const [qualifications, setQualifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQualifications();
    }, []);

    const fetchQualifications = async () => {
        try {
            const facultyId = JSON.parse(localStorage.getItem('user')).FacultyID;
            const response = await axios.get(`/faculty/qualifications/${facultyId}`);
            setQualifications(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch qualifications');
            setLoading(false);
        }
    };

    const handleDelete = async (qualificationId) => {
        if (window.confirm('Are you sure you want to delete this qualification?')) {
            try {
                await axios.delete(`/faculty/qualifications/${qualificationId}`);
                setQualifications(qualifications.filter(qual => qual.QualificationID !== qualificationId));
            } catch (err) {
                setError('Failed to delete qualification');
            }
        }
    };

    const formatYear = (dateString) => {
        return new Date(dateString).getFullYear().toString();
    };

    const getDegreeColor = (degree) => {
        const lowerDegree = degree.toLowerCase();
        if (lowerDegree.includes('phd') || lowerDegree.includes('doctorate')) {
            return 'bg-purple-100 text-purple-800';
        } else if (lowerDegree.includes('master')) {
            return 'bg-blue-100 text-blue-800';
        } else if (lowerDegree.includes('bachelor')) {
            return 'bg-green-100 text-green-800';
        }
        return 'bg-gray-100 text-gray-800';
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <BackButton to="/dashboard" />
                    <h1 className="text-2xl font-bold text-gray-800">Educational Qualifications</h1>
                </div>
                <PrimaryButton
                    onClick={() => navigate('/qualifications/new')}
                    className="px-4 py-2"
                >
                    Add New Qualification
                </PrimaryButton>
            </div>

            {qualifications.length === 0 ? (
                <p className="text-gray-600 text-center">No qualifications found. Add your educational qualifications!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {qualifications.map((qualification) => (
                        <div key={qualification.QualificationID} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDegreeColor(qualification.Degree)}`}>
                                    {qualification.Degree}
                                </span>
                                <span className="text-gray-600">
                                    {formatYear(qualification.YearOfCompletion)}
                                </span>
                            </div>
                            
                            <p className="text-gray-800 font-medium mb-2">
                                {qualification.Institution}
                            </p>

                            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                                <button
                                    onClick={() => navigate(`/qualifications/edit/${qualification.QualificationID}`)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(qualification.QualificationID)}
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

export default QualificationsPage;