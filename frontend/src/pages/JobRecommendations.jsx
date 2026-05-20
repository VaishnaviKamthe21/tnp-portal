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

    const getMatchLabel = (probability) => {
        if (probability >= 0.7) return 'Excellent Match';
        if (probability >= 0.4) return 'Good Match';
        return 'Potential Match';
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#8a8a84]" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-[#1a1a18] rounded-xl flex items-center justify-center shadow-md">
                        <Sparkles className="w-6 h-6 text-[#f0f0ee]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1a1a18] tracking-tight">Recommended for You</h1>
                        <p className="text-[#6b6b66] text-sm font-medium mt-1">Smart job matches based on your profile and skills</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 font-medium rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {recommendations.length > 0 ? (
                <div className="space-y-5">
                    {recommendations.map((rec) => (
                        <div
                            key={rec.job_id}
                            className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] overflow-hidden hover:border-[#d0cfcb] hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300"
                        >
                            <div className="p-7">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-5">
                                            <div className="w-14 h-14 bg-[#e6e5e1] rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="w-7 h-7 text-[#4a4a46]" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-[#1a1a18] mb-1.5">
                                                    {rec.job_title || 'Job Position'}
                                                </h3>
                                                <div className="flex items-center gap-2 text-[#8a8a84] font-medium text-sm mb-4">
                                                    <Building2 className="w-4 h-4" />
                                                    <span>{rec.company || 'Company Name'}</span>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e0dfdb] bg-[#f0f0ee]">
                                                        <TrendingUp className="w-4 h-4 text-[#1a1a18]" />
                                                        <span className="text-sm font-bold text-[#1a1a18]">
                                                            {Math.round(rec.probability * 100)}% Match
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-[#8a8a84] uppercase tracking-wider font-bold">
                                                        {getMatchLabel(rec.probability)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleApply(rec.job_id)}
                                            disabled={applyingTo === rec.job_id}
                                            className="px-8 py-3 bg-[#1a1a18] text-[#f0f0ee] font-bold rounded-xl hover:bg-black hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm uppercase tracking-wider"
                                        >
                                            {applyingTo === rec.job_id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Applying
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
                <div className="text-center py-24 bg-white/70 backdrop-blur-sm rounded-2xl border border-dashed border-[#d0cfcb]">
                    <div className="max-w-md mx-auto px-4">
                        <div className="w-16 h-16 bg-[#e6e5e1] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Sparkles className="w-8 h-8 text-[#6b6b66]" />
                        </div>
                        <h3 className="text-xl font-extrabold text-[#1a1a18] mb-3">No Recommendations Yet</h3>
                        <p className="text-[#8a8a84] font-medium text-sm mb-8 leading-relaxed">
                            Complete your profile with your latest skills, CGPA, and internship details to get personalized, AI-powered job recommendations.
                        </p>
                        <button
                            onClick={() => navigate('/profile')}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1a1a18] text-[#f0f0ee] font-bold rounded-xl hover:bg-black transition-all text-sm uppercase tracking-wider shadow-md hover:shadow-lg"
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
