import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import PrimaryButton from '../../components/PrimaryButton';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

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
        } catch (err) {
            setError('Failed to fetch citation metrics');
            setLoading(false);
        }
    };

    const handleDelete = async (metricsId) => {
        if (window.confirm('Are you sure you want to delete these citation metrics?')) {
            try {
                await axios.delete(`/api/faculty/citations/${metricsId}`);
                setMetrics(metrics.filter(m => m.MetricsID !== metricsId));
            } catch (err) {
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

    const prepareChartData = () => {
        // Group metrics by year and source
        const groupedData = {};
        metrics.forEach(metric => {
            if (!groupedData[metric.YearRecorded]) {
                groupedData[metric.YearRecorded] = {};
            }
            groupedData[metric.YearRecorded][metric.Source] = {
                citations: metric.TotalCitations,
                hIndex: metric.HIndex,
                i10Index: metric.I10Index
            };
        });

        // Convert to array format for chart
        return Object.entries(groupedData).map(([year, data]) => ({
            year: parseInt(year),
            ...Object.entries(data).reduce((acc, [source, metrics]) => ({
                ...acc,
                [`${source}_citations`]: metrics.citations,
                [`${source}_hIndex`]: metrics.hIndex,
                [`${source}_i10Index`]: metrics.i10Index
            }), {})
        })).sort((a, b) => a.year - b.year);
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

    const chartData = prepareChartData();

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
                    {/* Citation Metrics Chart */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Citation Trends</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {/* Add lines for each metric type and source */}
                                {metrics.reduce((acc, metric) => {
                                    const source = metric.Source;
                                    if (!acc.includes(`${source}_citations`)) {
                                        acc.push(`${source}_citations`);
                                    }
                                    return acc;
                                }, []).map((dataKey, index) => (
                                    <Line
                                        key={dataKey}
                                        type="monotone"
                                        dataKey={dataKey}
                                        name={`${dataKey.split('_')[0]} Citations`}
                                        stroke={index % 2 === 0 ? '#3B82F6' : '#F97316'}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
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