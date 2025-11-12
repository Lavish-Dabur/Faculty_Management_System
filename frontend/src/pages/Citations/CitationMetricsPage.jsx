import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import PrimaryButton from '../../components/PrimaryButton';

const CitationMetricsPage = () => {
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const facultyId = JSON.parse(localStorage.getItem('user')).FacultyID;
            const response = await axios.get(`/api/faculty/citations/${facultyId}`);
            setMetrics(response.data);
            setLoading(false);
        } catch {
            setError('Failed to fetch citation metrics');
            setLoading(false);
        }
    };

    const handleDelete = async (metricsId) => {
        if (window.confirm('Are you sure you want to delete these citation metrics?')) {
            try {
                await axios.delete(`/api/faculty/citations/${metricsId}`);
                setMetrics(metrics.filter(m => m.MetricsID !== metricsId));
            } catch {
                setError('Failed to delete citation metrics');
            }
        }
    };

    const getSourceColor = (source) => {
        switch (source.toLowerCase()) {
            case 'google scholar':
                return 'bg-blue-100 text-blue-800';
            case 'scopus':
                return 'bg-orange-100 text-orange-800';
            case 'web of science':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTotalsBySource = () => {
        const totals = {};
        metrics.forEach(metric => {
            if (!totals[metric.Source]) {
                totals[metric.Source] = {
                    totalCitations: 0,
                    maxHIndex: 0,
                    maxI10Index: 0,
                    count: 0
                };
            }
            totals[metric.Source].totalCitations += metric.TotalCitations || 0;
            totals[metric.Source].maxHIndex = Math.max(totals[metric.Source].maxHIndex, metric.HIndex || 0);
            totals[metric.Source].maxI10Index = Math.max(totals[metric.Source].maxI10Index, metric.I10Index || 0);
            totals[metric.Source].count += 1;
        });
        return totals;
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

    const totalsBySource = getTotalsBySource();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Citation Metrics</h1>
                <PrimaryButton
                    onClick={() => navigate('/citations/new')}
                    className="px-4 py-2"
                >
                    Add New Metrics
                </PrimaryButton>
            </div>

            {metrics.length === 0 ? (
                <p className="text-gray-600 text-center">No citation metrics found. Add your first citation metrics!</p>
            ) : (
                <>
                    {/* Summary Statistics */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Summary by Source</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Citations</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max h-index</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max i10-index</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Object.entries(totalsBySource).map(([source, data]) => (
                                        <tr key={source}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSourceColor(source)}`}>
                                                    {source}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.totalCitations}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.maxHIndex}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.maxI10Index}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {metrics.map((metric) => (
                            <div key={metric.MetricsID} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSourceColor(metric.Source)}`}>
                                        {metric.Source}
                                    </span>
                                    <span className="text-gray-600 font-medium">
                                        {metric.YearRecorded}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Total Citations:</span> {metric.TotalCitations || 'N/A'}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">h-index:</span> {metric.HIndex || 'N/A'}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">i10-index:</span> {metric.I10Index || 'N/A'}
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                                    <button
                                        onClick={() => navigate(`/citations/edit/${metric.MetricsID}`)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(metric.MetricsID)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default CitationMetricsPage;