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
    return (
        <div className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl border border-[#e0dfdb] bg-[#f0f0ee]">
            <span className="text-3xl font-extrabold text-[#1a1a18]">{Math.round(score)}%</span>
            <span className="text-xs text-[#8a8a84] font-bold uppercase tracking-wider mt-1">Match</span>
        </div>
    );
};

const ScorePill = ({ icon: Icon, label, value }) => {
    const pct = Math.round((value || 0) * 100);
    return (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#e6e5e1] text-[#4a4a46] border border-[#e0dfdb]">
            <Icon className="w-3.5 h-3.5 text-[#8a8a84]" />
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
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#8a8a84]" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-[#1a1a18] mb-1.5 tracking-tight">My Applications</h1>
                <p className="text-[#6b6b66] font-medium text-sm">Track the status and match analytics of your submitted applications.</p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-3">
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="space-y-4">
                {applications.length > 0 ? applications.map((app) => {
                    const job = jobs[app.job_id] || { title: 'Unknown Job', company: 'Unknown Company' };

                    return (
                        <div key={app.id} className="bg-white/70 backdrop-blur-sm p-7 rounded-2xl border border-[#e0dfdb] hover:border-[#d0cfcb] hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300">
                            <div className="flex flex-col md:flex-row md:items-center gap-8">
                                {app.match_score != null && (
                                    <MatchBadge score={app.match_score} />
                                )}

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-[#1a1a18]">{job.title}</h3>
                                    <p className="text-[#8a8a84] font-medium text-sm mb-4">{job.company}</p>

                                    <div className="flex flex-wrap gap-2.5 mb-5">
                                        {app.job_fit != null && (
                                            <ScorePill icon={Target} label="Skill Fit" value={app.job_fit} />
                                        )}
                                        {app.placement_probability != null && (
                                            <ScorePill icon={TrendingUp} label="Placement" value={app.placement_probability} />
                                        )}
                                        {app.domain_alignment != null && (
                                            <ScorePill icon={BarChart3} label="Domain" value={app.domain_alignment} />
                                        )}
                                        {app.readiness_category && (
                                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#e6e5e1] text-[#4a4a46] border border-[#e0dfdb]">
                                                <Zap className="w-3.5 h-3.5 text-[#8a8a84]" />
                                                {app.readiness_category}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-medium text-[#8a8a84] uppercase tracking-wider">
                                        <span className="flex items-center gap-1.5 border border-[#e0dfdb] px-3 py-1.5 rounded-lg bg-[#f0f0ee]">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Applied {app.applied_at
                                                ? new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                : 'recently'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end shrink-0 hidden md:flex">
                                    <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                                        app.status === 'offered'
                                            ? 'bg-[#1a1a18] text-[#f0f0ee]'
                                            : app.status === 'shortlisted'
                                                ? 'bg-[#d0cfcb] text-[#1a1a18]'
                                                : app.status === 'rejected'
                                                    ? 'bg-[#e0dfdb] text-[#8a8a84]'
                                                    : 'bg-[#f0f0ee] border border-[#e0dfdb] text-[#6b6b66]'
                                    }`}>
                                        <CheckCircle2 className="w-4 h-4" />
                                        {app.status || 'Under Review'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center py-24 bg-white/70 backdrop-blur-sm rounded-2xl border border-dashed border-[#d0cfcb]">
                        <div className="max-w-xs mx-auto">
                            <div className="w-16 h-16 bg-[#e6e5e1] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Briefcase className="w-8 h-8 text-[#6b6b66]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1a1a18] mb-2">No applications yet</h3>
                            <p className="text-[#8a8a84] font-medium text-sm mb-8">You haven't applied to any jobs. Explore opportunities to get started.</p>
                            <a
                                href="/student/jobs"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1a1a18] text-[#f0f0ee] font-bold rounded-lg hover:bg-black transition-all text-sm uppercase tracking-wider"
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
