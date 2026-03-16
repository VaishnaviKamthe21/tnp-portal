import { useState, useEffect } from 'react';
import {
    Users, Briefcase, BarChart3, CheckCircle2, TrendingUp,
    AlertCircle, Loader2, AlertTriangle, GraduationCap, FileText
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { getAdminDashboard } from '../services/admin';

/* ------------------------------------------------------------------ */
/*  Palette                                                            */
/* ------------------------------------------------------------------ */
const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const READINESS_COLORS = {
    'Industry Ready': '#22c55e',
    'Moderately Ready': '#f59e0b',
    'Needs Improvement': '#f97316',
    'Beginner Level': '#ef4444',
};

/* ------------------------------------------------------------------ */
/*  Small components                                                   */
/* ------------------------------------------------------------------ */
const StatCard = ({ icon: Icon, label, value, sub, gradient }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${gradient}`}>
        <div className="absolute top-3 right-3 opacity-20">
            <Icon className="w-16 h-16" />
        </div>
        <p className="text-sm font-medium opacity-90 mb-1">{label}</p>
        <h2 className="text-3xl font-black">{value}</h2>
        {sub && <p className="text-xs mt-1.5 opacity-80">{sub}</p>}
    </div>
);

const SectionHeader = ({ icon: Icon, title, color = 'text-blue-600' }) => (
    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-5">
        <Icon className={`w-5 h-5 ${color}`} /> {title}
    </h2>
);

const RiskRow = ({ name, dept, detail, color = 'red' }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
        <div>
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-400">{dept}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            color === 'red' ? 'bg-red-50 text-red-600'
                : color === 'amber' ? 'bg-amber-50 text-amber-600'
                : 'bg-blue-50 text-blue-600'
        }`}>{detail}</span>
    </div>
);

/* ------------------------------------------------------------------ */
/*  Custom Tooltip                                                     */
/* ------------------------------------------------------------------ */
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
                <p className="text-sm font-bold text-gray-900">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} className="text-sm text-gray-500">
                        {p.name}: <span className="font-semibold text-gray-900">{p.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                     */
/* ------------------------------------------------------------------ */
const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAdminDashboard()
            .then(setData)
            .catch(err => {
                console.error(err);
                setError('Failed to load dashboard data.');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Crunching dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    // Prepare chart data
    const deptChartData = (data.departments || []).map(d => ({
        name: d.department,
        total: d.total_students,
        placed: d.placed_students,
    }));

    const readinessData = (data.readiness_distribution || []).map(r => ({
        name: r.level,
        value: r.count,
        fill: READINESS_COLORS[r.level] || '#94a3b8',
    }));

    const probData = (data.probability_distribution || []).map((p, i) => ({
        range: p.range + '%',
        students: p.count,
        fill: COLORS[i % COLORS.length],
    }));

    const domainData = (data.domain_distribution || []).slice(0, 6);

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Real-time placement analytics & ML-powered insights.</p>
                </div>

                {/* ---- Core Metrics ---- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                    <StatCard icon={Users} label="Total Students" value={data.total_students} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                    <StatCard icon={CheckCircle2} label="Students Placed" value={data.students_placed} gradient="bg-gradient-to-br from-green-500 to-green-600" />
                    <StatCard icon={TrendingUp} label="Placement Rate" value={`${data.placement_rate}%`} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
                    <StatCard icon={Briefcase} label="Jobs Posted" value={data.total_jobs} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
                    <StatCard icon={FileText} label="Applications" value={data.total_applications} gradient="bg-gradient-to-br from-amber-500 to-orange-500" />
                </div>

                {/* ---- Charts Row 1: Prob Distribution + Readiness Pie ---- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Placement Probability Distribution */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <SectionHeader icon={BarChart3} title="Placement Probability Distribution" />
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={probData} barSize={36}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="students" name="Students" radius={[8, 8, 0, 0]}>
                                    {probData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Readiness Distribution Pie */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <SectionHeader icon={GraduationCap} title="Students by Readiness Level" color="text-emerald-600" />
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={readinessData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    labelLine={false}
                                >
                                    {readinessData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ---- Charts Row 2: Dept Breakdown + Domain Distribution ---- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Department Performance */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <SectionHeader icon={Users} title="Department Performance" color="text-purple-600" />
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={deptChartData} barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="total" name="Total" fill="#93c5fd" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="placed" name="Placed" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Domain Skill Gaps */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <SectionHeader icon={AlertTriangle} title="Domain Skill Gaps" color="text-amber-600" />
                        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                            {(data.domain_skill_gaps || []).map((dg, idx) => (
                                <div key={idx}>
                                    <p className="text-sm font-bold text-gray-900 mb-2">{dg.domain}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {dg.missing.map((m, i) => (
                                            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 font-medium border border-red-100">
                                                {m.skill} ({m.count})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {(!data.domain_skill_gaps || data.domain_skill_gaps.length === 0) && (
                                <p className="text-sm text-gray-400 py-8 text-center">No skill gap data available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ---- Risk Indicators ---- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                    {/* Low Probability */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <SectionHeader icon={AlertTriangle} title="Low Probability Students" color="text-red-500" />
                        <div className="max-h-[260px] overflow-y-auto">
                            {data.low_probability_students?.length > 0 ? (
                                data.low_probability_students.map((s, i) => (
                                    <RiskRow key={i} name={s.name} dept={s.department} detail={`${s.probability}%`} color="red" />
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 py-6 text-center">All students above threshold!</p>
                            )}
                        </div>
                    </div>

                    {/* No Internships */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <SectionHeader icon={Briefcase} title="No Internship Experience" color="text-amber-500" />
                        <div className="max-h-[260px] overflow-y-auto">
                            {data.no_internship_students?.length > 0 ? (
                                data.no_internship_students.map((s, i) => (
                                    <RiskRow key={i} name={s.name} dept={s.department} detail="No internships" color="amber" />
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 py-6 text-center">All students have internship experience!</p>
                            )}
                        </div>
                    </div>

                    {/* Below CGPA */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <SectionHeader icon={GraduationCap} title="Below CGPA Threshold (6.0)" color="text-orange-500" />
                        <div className="max-h-[260px] overflow-y-auto">
                            {data.below_cgpa_students?.length > 0 ? (
                                data.below_cgpa_students.map((s, i) => (
                                    <RiskRow key={i} name={s.name} dept={s.department} detail={`CGPA: ${s.cgpa}`} color="red" />
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 py-6 text-center">All students above threshold!</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ---- Department Table ---- */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-50">
                        <SectionHeader icon={BarChart3} title="Department-wise Breakdown" color="text-blue-600" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Placed</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.departments.map((dept, idx) => {
                                    const rate = dept.total_students ? Math.round((dept.placed_students / dept.total_students) * 100) : 0;
                                    return (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-gray-900">{dept.department}</td>
                                            <td className="px-6 py-4 text-gray-600">{dept.total_students}</td>
                                            <td className="px-6 py-4 text-gray-600">{dept.placed_students}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <span className="text-sm font-bold">{rate}%</span>
                                                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${rate > 75 ? 'bg-green-500' : rate > 40 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                                            style={{ width: `${rate}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
