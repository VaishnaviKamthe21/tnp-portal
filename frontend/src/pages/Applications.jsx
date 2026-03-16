import { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Briefcase,
    Loader2,
    Calendar,
    ArrowRight,
    TrendingUp,
    Target,
    Zap,
    BarChart3
} from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import { getStudentApplications } from '../services/jobs';
import { getJobs } from '../services/jobs';

const MatchBadge = ({ score }) => {
    let color, bg;
    if (score >= 70) { color = 'text-green-700'; bg = 'bg-green-50 border-green-200'; }
    else if (score >= 40) { color = 'text-amber-700'; bg = 'bg-amber-50 border-amber-200'; }
    else { color = 'text-red-600'; bg = 'bg-red-50 border-red-200'; }

    return (
        <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border ${bg}`}>
            <span className={`text-2xl font-black ${color}`}>{Math.round(score)}%</span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">Match</span>
        </div>
    );
};

const ScorePill = ({ icon: Icon, label, value, color = 'blue' }) => {
    const pct = Math.round((value || 0) * 100);
    const colorMap = {
        blue: 'bg-blue-50 text-blue-700',
        purple: 'bg-purple-50 text-purple-700',
        emerald: 'bg-emerald-50 text-emerald-700',
    };
    return (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${colorMap[color]}`}>
            <Icon className="w-3.5 h-3.5" />
            {label}: {pct}%
        </div>
    );
};

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = getCurrentUser();

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const [apps, allJobs] = await Promise.all([
                    getStudentApplications(user.id),
                    getJobs()
                ]);

                const jobMap = {};
                allJobs.forEach(job => { jobMap[job.id] = job; });

                setJobs(jobMap);
                setApplications(Array.isArray(apps) ? apps : []);
            } catch (err) {
                console.error('Error fetching applications:', err);
                setError('Failed to load your applications.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
                <p className="text-gray-500">Track the status and match analytics of your submitted applications.</p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="space-y-4">
                {applications.length > 0 ? applications.map((app) => {
                    const job = jobs[app.job_id] || { title: 'Unknown Job', company: 'Unknown Company' };

                    return (
                        <div key={app.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-blue-500/5 hover:border-blue-100 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                {/* Match Score Badge */}
                                {app.match_score != null && (
                                    <MatchBadge score={app.match_score} />
                                )}

                                {/* Job Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                    <p className="text-gray-500 text-sm font-medium mb-3">{job.company}</p>

                                    {/* ML Score Pills */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {app.job_fit != null && (
                                            <ScorePill icon={Target} label="Skill Fit" value={app.job_fit} color="blue" />
                                        )}
                                        {app.placement_probability != null && (
                                            <ScorePill icon={TrendingUp} label="Placement" value={app.placement_probability} color="emerald" />
                                        )}
                                        {app.domain_alignment != null && (
                                            <ScorePill icon={BarChart3} label="Domain" value={app.domain_alignment} color="purple" />
                                        )}
                                        {app.readiness_category && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                                <Zap className="w-3.5 h-3.5" />
                                                {app.readiness_category}
                                            </div>
                                        )}
                                    </div>

                                    {/* Applied Date */}
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Applied {app.applied_at
                                                ? new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                : 'recently'}
                                        </span>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="flex flex-col items-end">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                        app.status === 'offered'
                                            ? 'bg-green-50 text-green-600'
                                            : app.status === 'shortlisted'
                                                ? 'bg-amber-50 text-amber-600'
                                                : app.status === 'rejected'
                                                    ? 'bg-red-50 text-red-500'
                                                    : 'bg-blue-50 text-blue-600'
                                    }`}>
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        {app.status || 'Under Review'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="max-w-xs mx-auto">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No applications yet</h3>
                            <p className="text-gray-500 text-sm mb-6">You haven't applied to any jobs. Explore opportunities to get started!</p>
                            <a
                                href="/student/jobs"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                            >
                                Browse Jobs
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applications;
