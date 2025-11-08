import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import FormContainer from '../../components/FormContainer';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';

const AddCitationMetricsPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        source: '',
        yearRecorded: new Date().getFullYear(),
        hIndex: '',
        i10Index: '',
        totalCitations: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const citationSources = [
        'Google Scholar',
        'Scopus',
        'Web of Science',
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
            await axios.post('/api/faculty/citations', {
                ...formData,
                facultyId
            });
            navigate('/citations');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add citation metrics');
        } finally {
            setLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

    return (
        <FormContainer>
            <h2 className="text-2xl font-bold text-center mb-6">Add New Citation Metrics</h2>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Citation Source
                    </label>
                    <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select Citation Source</option>
                        {citationSources.map(source => (
                            <option key={source} value={source}>{source}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Year
                    </label>
                    <select
                        name="yearRecorded"
                        value={formData.yearRecorded}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <FormInput
                    label="h-index"
                    name="hIndex"
                    type="number"
                    min="0"
                    value={formData.hIndex}
                    onChange={handleChange}
                    placeholder="Enter h-index"
                />

                <FormInput
                    label="i10-index"
                    name="i10Index"
                    type="number"
                    min="0"
                    value={formData.i10Index}
                    onChange={handleChange}
                    placeholder="Enter i10-index"
                />

                <FormInput
                    label="Total Citations"
                    name="totalCitations"
                    type="number"
                    min="0"
                    value={formData.totalCitations}
                    onChange={handleChange}
                    placeholder="Enter total citations"
                />

                <div className="flex justify-between pt-4">
                    <PrimaryButton
                        type="button"
                        onClick={() => navigate('/citations')}
                        className="bg-gray-500 hover:bg-gray-600"
                    >
                        Cancel
                    </PrimaryButton>
                    <PrimaryButton
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Metrics'}
                    </PrimaryButton>
                </div>
            </form>
        </FormContainer>
    );
};

export default AddCitationMetricsPage;