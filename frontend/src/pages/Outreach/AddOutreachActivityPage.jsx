import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import FormContainer from '../../components/FormContainer';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';

const AddOutreachActivityPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        activityTitle: '',
        activityType: '',
        institutionName: '',
        activityDate: new Date().toISOString().split('T')[0],
        description: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const activityTypes = [
        'Community Service',
        'Guest Lecture',
        'Workshop',
        'Social Initiative',
        'Consulting',
        'Advisory Role',
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
            await axios.post('/api/faculty/outreach', {
                ...formData,
                facultyId
            });
            navigate('/outreach');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add outreach activity');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer>
            <h2 className="text-2xl font-bold text-center mb-6">Add New Outreach Activity</h2>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="Activity Title"
                    name="activityTitle"
                    type="text"
                    value={formData.activityTitle}
                    onChange={handleChange}
                    required
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Activity Type
                    </label>
                    <select
                        name="activityType"
                        value={formData.activityType}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select Activity Type</option>
                        {activityTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <FormInput
                    label="Institution Name"
                    name="institutionName"
                    type="text"
                    value={formData.institutionName}
                    onChange={handleChange}
                />

                <FormInput
                    label="Activity Date"
                    name="activityDate"
                    type="date"
                    value={formData.activityDate}
                    onChange={handleChange}
                    required
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Provide details about the activity..."
                    />
                </div>

                <div className="flex justify-between pt-4">
                    <PrimaryButton
                        type="button"
                        onClick={() => navigate('/outreach')}
                        className="bg-gray-500 hover:bg-gray-600"
                    >
                        Cancel
                    </PrimaryButton>
                    <PrimaryButton
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Activity'}
                    </PrimaryButton>
                </div>
            </form>
        </FormContainer>
    );
};

export default AddOutreachActivityPage;