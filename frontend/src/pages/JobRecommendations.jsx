import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles,
    Briefcase,
    Building2,
    TrendingUp,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import { getRecommendedJobs, applyToJob } from '../services/jobs';

const JobRecommendations = () => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applyingTo, setApplyingTo] = useState(null);
    const user = getCurrentUser();

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!user) return;
            try {
                const data = await getRecommendedJobs(user.id);
                setRecommendations(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setError('Failed to load job recommendations.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user]);

    const handleApply = async (jobId) => {
        if (!user) return;
        setApplyingTo(jobId);
        try {
            await applyToJob(jobId, user.id);
            alert('Applied successfully!');
        } catch (err) {
            console.error('Error applying:', err);
            alert('Failed to apply. Please try again.');
        } finally {
            setApplyingTo(null);
        }
    };

    const getMatchColor = (probability) => {
        if (probability >= 0.7) return 'text-green-600 bg-green-50 border-green-200';
        if (probability >= 0.4) return 'text-blue-600 bg-blue-50 border-blue-200';
        return 'text-orange-600 bg-orange-50 border-orange-200';
    };

    const getMatchLabel = (probability) => {
        if (probability >= 0.7) return 'Excellent Match';
        if (probability >= 0.4) return 'Good Match';
        return 'Potential Match';
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Recommended for You</h1>
                        <p className="text-gray-500">AI-powered job matches based on your profile</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {recommendations.length > 0 ? (
                <div className="space-y-4">
                    {recommendations.map((rec) => (
                        <div
                            key={rec.job_id}
                            className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-500/5 overflow-hidden hover:border-blue-100 transition-all"
                        >
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    {/* Job Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="w-7 h-7 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                    {rec.job_title || 'Job Position'}
                                                </h3>
                                                <div className="flex items-center gap-2 text-gray-500 mb-3">
                                                    <Building2 className="w-4 h-4" />
                                                    <span className="font-medium">{rec.company || 'Company Name'}</span>
                                                </div>

                                                {/* Match Score */}
                                                <div className="flex items-center gap-3">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getMatchColor(rec.probability)}`}>
                                                        <TrendingUp className="w-4 h-4" />
                                                        <span className="text-sm font-bold">
                                                            {Math.round(rec.probability * 100)}% Match
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        {getMatchLabel(rec.probability)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Apply Button */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleApply(rec.job_id)}
                                            disabled={applyingTo === rec.job_id}
                                            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {applyingTo === rec.job_id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Applying...
                                                </>
                                            ) : (
                                                <>
                                                    Apply Now
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No Recommendations Yet</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Complete your profile to get personalized job recommendations!
                        </p>
                        <button
                            onClick={() => navigate('/profile')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                        >
                            Complete Profile
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobRecommendations;
