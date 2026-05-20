import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp, Target, BarChart3, Briefcase,
    CheckCircle2, AlertCircle, ArrowRight, Loader2,
    BookOpen, Award, Compass, Clock
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell
} from 'recharts';
import { getCurrentUser } from '../services/auth';
import { getDashboard } from '../services/student';

/* ------------------------------------------------------------------ */
/*  Small reusable components                                          */
/* ------------------------------------------------------------------ */

const StatCard = ({ icon: Icon, label, value, sub }) => {
    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-[#e0dfdb] p-6 hover:border-[#d0cfcb] hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#e6e5e1] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#4a4a46]" />
                </div>
                {sub && <span className="text-xs font-semibold text-[#a0a09b] uppercase tracking-widest mt-1">{sub}</span>}
            </div>
            <p className="text-sm font-medium text-[#8a8a84] mb-1">{label}</p>
            <p className="text-2xl font-extrabold text-[#1a1a18]">{value}</p>
        </div>
    );
};

const SkillTag = ({ name, type = 'aligned' }) => {
    const styles = type === 'aligned'
        ? 'bg-[#e6e5e1] text-[#4a4a46] border-[#d0cfcb]'
        : 'bg-[#f0f0ee] text-[#8a8a84] border-[#d0cfcb] border-dashed';
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${styles}`}>
            {name}
        </span>
    );
};

const ReadinessBadge = ({ level }) => {
    const map = {
        'Industry Ready': { bg: 'bg-[#1a1a18] text-[#f0f0ee]', icon: Award },
        'Moderately Ready': { bg: 'bg-[#cfceca] text-[#4a4a46]', icon: TrendingUp },
        'Needs Improvement': { bg: 'bg-[#e6e5e1] text-[#6b6b66]', icon: AlertCircle },
        'Beginner Level': { bg: 'bg-white text-[#8a8a84] border border-[#e0dfdb]', icon: AlertCircle },
    };
    const cfg = map[level] || map['Beginner Level'];
    const BadgeIcon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold ${cfg.bg}`}>
            <BadgeIcon className="w-4 h-4" /> {level}
        </span>
    );
};

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                     */
/* ------------------------------------------------------------------ */

const StudentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = getCurrentUser();

    useEffect(() => {
        if (!user) return;
        getDashboard(user.id)
            .then(setData)
            .catch(err => {
                console.error(err);
                setError('Failed to load dashboard.');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#a0a09b]" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                <AlertCircle className="w-10 h-10 text-[#a0a09b] mx-auto mb-4" />
                <p className="text-[#8a8a84] font-medium">{error || 'Something went wrong.'}</p>
            </div>
        );
    }

    const placementPct = Math.round(data.placement_probability * 100);
    const aligned = Object.values(data.aligned_skills || {}).flat();
    const missing = Object.values(data.missing_skills || {}).flat();

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-[#1a1a18] tracking-tight">
                    Welcome back, {data.student_name?.split(' ')[0]}
                </h1>
                <p className="text-[#6b6b66] mt-1.5 text-sm font-medium flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#e0dfdb] rounded text-[#4a4a46] text-xs uppercase tracking-wider">{data.department}</span>
                    Here's your personalized placement intelligence.
                </p>
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <StatCard icon={TrendingUp} label="Placement Probability" value={`${placementPct}%`} />
                <StatCard icon={Compass} label="Recommended Domain" value={data.recommended_domain || '—'} />
                <StatCard icon={BarChart3} label="Domain Alignment" value={`${data.domain_alignment_pct}%`} />
                <StatCard icon={Briefcase} label="Jobs Applied" value={data.total_applications} />
            </div>

            {/* Score Gauge + Match Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

                {/* Radial Score Gauge */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-7">
                    <h2 className="text-sm font-bold text-[#1a1a18] uppercase tracking-wider flex items-center gap-2 mb-6">
                        <Target className="w-4 h-4 text-[#8a8a84]" /> Score Breakdown
                    </h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" barSize={16}
                            data={[
                                { name: 'Domain', value: data.domain_alignment_pct, fill: '#8a8a84' },
                                { name: 'Placement', value: placementPct, fill: '#1a1a18' },
                            ]}
                            startAngle={180} endAngle={0}
                        >
                            <RadialBar background={{ fill: '#e6e5e1' }} clockWise dataKey="value" />
                            <Tooltip formatter={(val) => `${val}%`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-6 text-xs font-semibold uppercase tracking-wider mt-2">
                        <span className="flex items-center gap-2 text-[#1a1a18]"><span className="w-3 h-3 rounded bg-[#1a1a18]" /> Placement {placementPct}%</span>
                        <span className="flex items-center gap-2 text-[#4a4a46]"><span className="w-3 h-3 rounded bg-[#8a8a84]" /> Domain {data.domain_alignment_pct}%</span>
                    </div>
                </div>

                {/* Application Match Scores Chart */}
                {data.applications.length > 0 && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-7">
                        <h2 className="text-sm font-bold text-[#1a1a18] uppercase tracking-wider flex items-center gap-2 mb-6">
                            <BarChart3 className="w-4 h-4 text-[#8a8a84]" /> Match Scores by Job
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data.applications.filter(a => a.match_score != null).map(a => ({
                                name: a.job_title.length > 12 ? a.job_title.slice(0, 12) + '...' : a.job_title,
                                score: Math.round(a.match_score),
                            }))} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b6b66' }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b6b66' }} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(val) => `${val}%`} cursor={{ fill: '#f0f0ee' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="score" name="Match %" radius={[4, 4, 0, 0]}>
                                    {data.applications.filter(a => a.match_score != null).map((a, i) => (
                                        <Cell key={i} fill={a.match_score >= 70 ? '#1a1a18' : a.match_score >= 40 ? '#8a8a84' : '#d0cfcb'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Two-Column: Placement + Domain */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

                {/* Placement Overview */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-7">
                    <h2 className="text-sm font-bold text-[#1a1a18] uppercase tracking-wider flex items-center gap-2 mb-6">
                        <TrendingUp className="w-4 h-4 text-[#8a8a84]" /> Placement Overview
                    </h2>

                    <div className="mb-7">
                        <div className="flex justify-between text-sm mb-3">
                            <span className="text-[#6b6b66] font-medium">Placement Probability</span>
                            <span className="font-bold text-[#1a1a18]">{placementPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#e6e5e1] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#1a1a18] transition-all duration-700"
                                style={{ width: `${placementPct}%` }}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-[#8a8a84] font-medium mb-3">Readiness Level</p>
                        <ReadinessBadge level={data.readiness_level} />
                    </div>

                    {data.shap_summary && (
                        <div className="mt-8 space-y-5">
                            {data.shap_summary.positive?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-[#1a1a18] uppercase tracking-wider mb-3">Strengths</p>
                                    {data.shap_summary.positive.map((f, i) => (
                                        <p key={i} className="text-sm text-[#4a4a46] flex items-start gap-2.5 mb-2 font-medium">
                                            <CheckCircle2 className="w-4 h-4 text-[#8a8a84] mt-0.5 flex-shrink-0" /> {f}
                                        </p>
                                    ))}
                                </div>
                            )}
                            {data.shap_summary.negative?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-[#1a1a18] uppercase tracking-wider mb-3 mt-5">Areas to Improve</p>
                                    {data.shap_summary.negative.map((f, i) => (
                                        <p key={i} className="text-sm text-[#4a4a46] flex items-start gap-2.5 mb-2 font-medium">
                                            <AlertCircle className="w-4 h-4 text-[#8a8a84] mt-0.5 flex-shrink-0" /> {f}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Domain Guidance */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-7">
                    <h2 className="text-sm font-bold text-[#1a1a18] uppercase tracking-wider flex items-center gap-2 mb-6">
                        <Compass className="w-4 h-4 text-[#8a8a84]" /> Domain Guidance
                    </h2>

                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-14 h-14 bg-[#1a1a18] rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-[#f0f0ee]" />
                        </div>
                        <div>
                            <p className="text-sm text-[#8a8a84] font-medium mb-1">Recommended Domain</p>
                            <p className="text-xl font-extrabold text-[#1a1a18]">{data.recommended_domain || '—'}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between text-sm mb-3">
                            <span className="text-[#6b6b66] font-medium">Domain Alignment</span>
                            <span className="font-bold text-[#1a1a18]">{data.domain_alignment_pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#e6e5e1] rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-[#8a8a84] transition-all duration-700" style={{ width: `${data.domain_alignment_pct}%` }} />
                        </div>
                    </div>

                    <ReadinessBadge level={data.readiness_level} />
                </div>
            </div>

            {/* Skills Insights */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-7 mb-10">
                <h2 className="text-sm font-bold text-[#1a1a18] uppercase tracking-wider flex items-center gap-2 mb-6">
                    <Target className="w-4 h-4 text-[#8a8a84]" /> Skills Insights
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-xs font-bold text-[#1a1a18] uppercase tracking-wider mb-4">Aligned Skills</p>
                        <div className="flex flex-wrap gap-2.5">
                            {aligned.length > 0
                                ? aligned.map((s, i) => <SkillTag key={i} name={s} type="aligned" />)
                                : <p className="text-sm text-[#8a8a84]">No aligned skills found yet.</p>
                            }
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-[#8a8a84] uppercase tracking-wider mb-4">Missing Skills</p>
                        <div className="flex flex-wrap gap-2.5">
                            {missing.length > 0
                                ? missing.map((s, i) => <SkillTag key={i} name={s} type="missing" />)
                                : <p className="text-sm text-[#a0a09b]">Great — you have full coverage!</p>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Tracking */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-7 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-bold text-[#1a1a18] uppercase tracking-wider flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#8a8a84]" /> Application Tracking
                    </h2>
                    <Link
                        to="/student/applications"
                        className="text-sm text-[#1a1a18] font-bold hover:underline flex items-center gap-1 transition-colors"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {data.applications.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[#8a8a84] text-xs uppercase tracking-wider border-b border-[#e0dfdb]">
                                    <th className="pb-4 font-bold">Job</th>
                                    <th className="pb-4 font-bold">Company</th>
                                    <th className="pb-4 font-bold">Match</th>
                                    <th className="pb-4 font-bold">Status</th>
                                    <th className="pb-4 font-bold text-right">Applied</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.applications.map((app) => (
                                    <tr key={app.id} className="border-b border-[#e0dfdb] hover:bg-white/80 transition-colors">
                                        <td className="py-4 font-bold text-[#1a1a18]">{app.job_title}</td>
                                        <td className="py-4 text-[#6b6b66] font-medium">{app.company}</td>
                                        <td className="py-4">
                                            {app.match_score != null ? (
                                                <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-[#f0f0ee] font-bold text-[#1a1a18] text-xs">
                                                    {Math.round(app.match_score)}%
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                                app.status === 'offered' ? 'bg-[#1a1a18] text-white'
                                                    : app.status === 'shortlisted' ? 'bg-[#d0cfcb] text-[#1a1a18]'
                                                    : app.status === 'rejected' ? 'bg-[#e0dfdb] text-[#8a8a84]'
                                                    : 'bg-[#f0f0ee] border border-[#e0dfdb] text-[#6b6b66]'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-[#8a8a84] font-medium flex items-center justify-end gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {app.applied_at
                                                ? new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                                                : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Briefcase className="w-10 h-10 text-[#d0cfcb] mx-auto mb-4" />
                        <p className="text-[#8a8a84] font-medium mb-6">You haven't applied to any jobs yet.</p>
                        <Link
                            to="/student/jobs"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a18] text-[#f0f0ee] font-medium rounded-lg hover:bg-black transition-all text-sm"
                        >
                            Browse Jobs <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
