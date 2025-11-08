import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import FormContainer from '../../components/FormContainer';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';

const AddQualificationPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        degree: '',
        institution: '',
        yearOfCompletion: new Date().getFullYear().toString()
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const commonDegrees = [
        'Ph.D.',
        'M.Phil.',
        'M.Tech.',
        'M.E.',
        'M.Sc.',
        'M.A.',
        'B.Tech.',
        'B.E.',
        'B.Sc.',
        'B.A.',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const facultyId = JSON.parse(localStorage.getItem('user')).FacultyID;
            await axios.post('/api/faculty/qualifications', {
                ...formData,
                facultyId,
                yearOfCompletion: `${formData.yearOfCompletion}-01-01` // Convert to date format
            });
            navigate('/qualifications');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add qualification');
        } finally {
            setLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

    return (
        <FormContainer>
            <h2 className="text-2xl font-bold text-center mb-6">Add New Qualification</h2>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Degree
                    </label>
                    <select
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select Degree</option>
                        {commonDegrees.map(degree => (
                            <option key={degree} value={degree}>{degree}</option>
                        ))}
                    </select>
                </div>

                <FormInput
                    label="Institution"
                    name="institution"
                    type="text"
                    value={formData.institution}
                    onChange={handleChange}
                    required
                    placeholder="Name of University/Institution"
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Year of Completion
                    </label>
                    <select
                        name="yearOfCompletion"
                        value={formData.yearOfCompletion}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-between pt-4">
                    <PrimaryButton
                        type="button"
                        onClick={() => navigate('/qualifications')}
                        className="bg-gray-500 hover:bg-gray-600"
                    >
                        Cancel
                    </PrimaryButton>
                    <PrimaryButton
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Qualification'}
                    </PrimaryButton>
                </div>
            </form>
        </FormContainer>
    );
};

export default AddQualificationPage;