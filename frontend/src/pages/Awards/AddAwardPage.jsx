import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import FormContainer from '../../components/FormContainer';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';

const AddAwardPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        awardName: '',
        awardingBody: '',
        location: '',
        yearAwarded: new Date().getFullYear()
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            await axios.post('/api/faculty/awards', {
                ...formData,
                facultyId
            });
            navigate('/dashboard/awards');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add award');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer>
            <h2 className="text-2xl font-bold text-center mb-6">Add New Award</h2>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="Award Name"
                    name="awardName"
                    type="text"
                    value={formData.awardName}
                    onChange={handleChange}
                    required
                />

                <FormInput
                    label="Awarding Body"
                    name="awardingBody"
                    type="text"
                    value={formData.awardingBody}
                    onChange={handleChange}
                />

                <FormInput
                    label="Location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                />

                <FormInput
                    label="Year Awarded"
                    name="yearAwarded"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.yearAwarded}
                    onChange={handleChange}
                    required
                />

                <div className="flex justify-between pt-4">
                    <PrimaryButton
                        type="button"
                        onClick={() => navigate('/dashboard/awards')}
                        className="bg-gray-500 hover:bg-gray-600"
                    >
                        Cancel
                    </PrimaryButton>
                    <PrimaryButton
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Award'}
                    </PrimaryButton>
                </div>
            </form>
        </FormContainer>
    );
};

export default AddAwardPage;