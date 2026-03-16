import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp, Target, Zap, BarChart3, Briefcase,
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

const StatCard = ({ icon: Icon, label, value, sub, color = 'blue' }) => {
    const palette = {
        blue: 'from-blue-500 to-blue-600 shadow-blue-500/25',
        emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/25',
        purple: 'from-purple-500 to-purple-600 shadow-purple-500/25',
        amber: 'from-amber-500 to-amber-600 shadow-amber-500/25',
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${palette[color]} shadow-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {sub && <span className="text-xs font-medium text-gray-400 mt-1">{sub}</span>}
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
            <p className="text-2xl font-black text-gray-900">{value}</p>
        </div>
    );
};

const SkillTag = ({ name, type = 'aligned' }) => {
    const styles = type === 'aligned'
        ? 'bg-green-50 text-green-700 border-green-200'
        : 'bg-red-50 text-red-600 border-red-200';
    const icon = type === 'aligned' ? '✅' : '📌';
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border ${styles}`}>
            {icon} {name}
        </span>
    );
};

const ReadinessBadge = ({ level }) => {
    const map = {
        'Industry Ready': { bg: 'bg-green-50 border-green-200 text-green-700', icon: Award },
        'Moderately Ready': { bg: 'bg-amber-50 border-amber-200 text-amber-700', icon: TrendingUp },
        'Needs Improvement': { bg: 'bg-orange-50 border-orange-200 text-orange-600', icon: AlertCircle },
        'Beginner Level': { bg: 'bg-red-50 border-red-200 text-red-600', icon: AlertCircle },
    };
    const cfg = map[level] || map['Beginner Level'];
    const BadgeIcon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border ${cfg.bg}`}>
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
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-gray-600">{error || 'Something went wrong.'}</p>
            </div>
        );
    }

    const placementPct = Math.round(data.placement_probability * 100);

    // flatten skills for display
    const aligned = Object.values(data.aligned_skills || {}).flat();
    const missing = Object.values(data.missing_skills || {}).flat();

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900">
                    Welcome back, {data.student_name?.split(' ')[0]} 👋
                </h1>
                <p className="text-gray-500 mt-1">
                    {data.department} • Here's your personalized placement intelligence.
                </p>
            </div>

            {/* ---- Stat Cards Row ---- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <StatCard icon={TrendingUp} label="Placement Probability" value={`${placementPct}%`} color="blue" />
                <StatCard icon={Compass} label="Recommended Domain" value={data.recommended_domain || '—'} color="purple" />
                <StatCard icon={BarChart3} label="Domain Alignment" value={`${data.domain_alignment_pct}%`} color="emerald" />
                <StatCard icon={Briefcase} label="Jobs Applied" value={data.total_applications} color="amber" />
            </div>

            {/* ---- Score Gauge + Match Chart Row ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

                {/* Radial Score Gauge */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-blue-600" /> Score Breakdown
                    </h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" barSize={14}
                            data={[
                                { name: 'Domain', value: data.domain_alignment_pct, fill: '#8b5cf6' },
                                { name: 'Placement', value: placementPct, fill: '#3b82f6' },
                            ]}
                            startAngle={180} endAngle={0}
                        >
                            <RadialBar background clockWise dataKey="value" />
                            <Tooltip formatter={(val) => `${val}%`} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-6 text-xs font-semibold mt-1">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500" /> Placement {placementPct}%</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500" /> Domain {data.domain_alignment_pct}%</span>
                    </div>
                </div>

                {/* Application Match Scores Chart */}
                {data.applications.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                            <BarChart3 className="w-5 h-5 text-amber-600" /> Match Scores by Job
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data.applications.filter(a => a.match_score != null).map(a => ({
                                name: a.job_title.length > 12 ? a.job_title.slice(0, 12) + '…' : a.job_title,
                                score: Math.round(a.match_score),
                            }))} barSize={28}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(val) => `${val}%`} />
                                <Bar dataKey="score" name="Match %" radius={[8, 8, 0, 0]}>
                                    {data.applications.filter(a => a.match_score != null).map((a, i) => (
                                        <Cell key={i} fill={a.match_score >= 70 ? '#22c55e' : a.match_score >= 40 ? '#f59e0b' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* ---- Two-Column: Placement + Domain ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

                {/* Placement Overview */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-5">
                        <TrendingUp className="w-5 h-5 text-blue-600" /> Placement Overview
                    </h2>

                    {/* Probability bar */}
                    <div className="mb-5">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500 font-medium">Placement Probability</span>
                            <span className={`font-bold ${placementPct >= 70 ? 'text-green-600' : placementPct >= 40 ? 'text-amber-600' : 'text-red-500'}`}>{placementPct}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${placementPct >= 70 ? 'bg-gradient-to-r from-green-400 to-green-500' : placementPct >= 40 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
                                style={{ width: `${placementPct}%` }}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <p className="text-sm text-gray-500 font-medium mb-2">Readiness Level</p>
                        <ReadinessBadge level={data.readiness_level} />
                    </div>

                    {/* SHAP Factors */}
                    {data.shap_summary && (
                        <div className="mt-5 space-y-3">
                            {data.shap_summary.positive?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Strengths</p>
                                    {data.shap_summary.positive.map((f, i) => (
                                        <p key={i} className="text-sm text-gray-600 flex items-start gap-2 mb-1">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> {f}
                                        </p>
                                    ))}
                                </div>
                            )}
                            {data.shap_summary.negative?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Areas to Improve</p>
                                    {data.shap_summary.negative.map((f, i) => (
                                        <p key={i} className="text-sm text-gray-600 flex items-start gap-2 mb-1">
                                            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" /> {f}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Domain Guidance */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-5">
                        <Compass className="w-5 h-5 text-purple-600" /> Domain Guidance
                    </h2>

                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-7 h-7 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Recommended Domain</p>
                            <p className="text-xl font-bold text-gray-900">{data.recommended_domain || '—'}</p>
                        </div>
                    </div>

                    {/* Alignment bar */}
                    <div className="mb-5">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500 font-medium">Domain Alignment</span>
                            <span className="font-bold text-purple-600">{data.domain_alignment_pct}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-700" style={{ width: `${data.domain_alignment_pct}%` }} />
                        </div>
                    </div>

                    <ReadinessBadge level={data.readiness_level} />
                </div>
            </div>

            {/* ---- Skills Insights ---- */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-10">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-5">
                    <Target className="w-5 h-5 text-blue-600" /> Skills Insights
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-sm font-bold text-green-600 uppercase tracking-wider mb-3">Aligned Skills</p>
                        <div className="flex flex-wrap gap-2">
                            {aligned.length > 0
                                ? aligned.map((s, i) => <SkillTag key={i} name={s} type="aligned" />)
                                : <p className="text-sm text-gray-400">No aligned skills found yet.</p>
                            }
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3">Missing Skills</p>
                        <div className="flex flex-wrap gap-2">
                            {missing.length > 0
                                ? missing.map((s, i) => <SkillTag key={i} name={s} type="missing" />)
                                : <p className="text-sm text-gray-400">Great — you have full coverage!</p>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* ---- Application Tracking ---- */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-amber-600" /> Application Tracking
                    </h2>
                    <Link
                        to="/student/applications"
                        className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {data.applications.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="pb-3 font-semibold">Job</th>
                                    <th className="pb-3 font-semibold">Company</th>
                                    <th className="pb-3 font-semibold">Match</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 font-semibold">Applied</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.applications.map((app) => (
                                    <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 font-semibold text-gray-900">{app.job_title}</td>
                                        <td className="py-3 text-gray-600">{app.company}</td>
                                        <td className="py-3">
                                            {app.match_score != null ? (
                                                <span className={`font-bold ${app.match_score >= 70 ? 'text-green-600' : app.match_score >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                                                    {Math.round(app.match_score)}%
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                                app.status === 'offered' ? 'bg-green-50 text-green-600'
                                                    : app.status === 'shortlisted' ? 'bg-amber-50 text-amber-600'
                                                    : app.status === 'rejected' ? 'bg-red-50 text-red-500'
                                                    : 'bg-blue-50 text-blue-600'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-400 flex items-center gap-1">
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
                    <div className="text-center py-12">
                        <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm mb-4">You haven't applied to any jobs yet.</p>
                        <Link
                            to="/student/jobs"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all text-sm"
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
