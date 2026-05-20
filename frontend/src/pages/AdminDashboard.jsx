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
const COLORS = ['#1a1a18', '#4a4a46', '#6b6b66', '#8a8a84', '#a0a09b', '#d0cfcb'];
const READINESS_COLORS = {
    'Industry Ready': '#1a1a18',
    'Moderately Ready': '#6b6b66',
    'Needs Improvement': '#a0a09b',
    'Beginner Level': '#d0cfcb',
};

/* ------------------------------------------------------------------ */
/*  Small components                                                   */
/* ------------------------------------------------------------------ */
const StatCard = ({ icon: Icon, label, value, sub }) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-6 hover:border-[#d0cfcb] hover:shadow-sm transition-all">
        <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-[#e6e5e1] rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#4a4a46]" />
            </div>
        </div>
        <p className="text-sm font-bold text-[#8a8a84] uppercase tracking-wider mb-2">{label}</p>
        <h2 className="text-3xl font-extrabold text-[#1a1a18]">{value}</h2>
        {sub && <p className="text-xs font-semibold mt-2 text-[#a0a09b] uppercase tracking-widest">{sub}</p>}
    </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
    <h2 className="text-sm font-bold text-[#1a1a18] uppercase tracking-wider flex items-center gap-2 mb-6">
        <Icon className="w-4 h-4 text-[#8a8a84]" /> {title}
    </h2>
);

const RiskRow = ({ name, dept, detail, severity = 'high' }) => (
    <div className="flex items-center justify-between py-3 border-b border-[#e0dfdb] last:border-0 hover:bg-white/40 transition-colors px-2 rounded-lg -mx-2">
        <div>
            <p className="text-sm font-bold text-[#1a1a18]">{name}</p>
            <p className="text-xs font-medium text-[#8a8a84] mt-0.5">{dept}</p>
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg ${
            severity === 'high' ? 'bg-[#1a1a18] text-[#f0f0ee]'
                : severity === 'medium' ? 'bg-[#d0cfcb] text-[#1a1a18]'
                : 'bg-[#e0dfdb] text-[#6b6b66]'
        }`}>{detail}</span>
    </div>
);

/* ------------------------------------------------------------------ */
/*  Custom Tooltip                                                     */
/* ------------------------------------------------------------------ */
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-[#e0dfdb] px-5 py-4">
                <p className="text-sm font-bold text-[#1a1a18] mb-2">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} className="text-sm font-medium text-[#6b6b66] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
                        {p.name}: <span className="font-bold text-[#1a1a18]">{p.value}</span>
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
                    <Loader2 className="w-8 h-8 animate-spin text-[#8a8a84] mx-auto mb-4" />
                    <p className="text-[#6b6b66] text-sm font-bold uppercase tracking-wider">Loading Intelligence...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                <AlertCircle className="w-10 h-10 text-[#8a8a84] mx-auto mb-4" />
                <p className="text-[#6b6b66] font-medium">{error}</p>
            </div>
        );
    }

    const deptChartData = (data.departments || []).map(d => ({
        name: d.department,
        total: d.total_students,
        placed: d.placed_students,
    }));

    const readinessData = (data.readiness_distribution || []).map(r => ({
        name: r.level,
        value: r.count,
        fill: READINESS_COLORS[r.level] || '#d0cfcb',
    }));

    const probData = (data.probability_distribution || []).map((p, i) => ({
        range: p.range + '%',
        students: p.count,
        fill: COLORS[i % COLORS.length],
    }));

    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-[#1a1a18] tracking-tight">Placement Intelligence</h1>
                    <p className="text-[#8a8a84] mt-2 text-sm font-medium">Real-time placement analytics and ML-powered insights.</p>
                </div>

                {/* Core Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
                    <StatCard icon={Users} label="Total Students" value={data.total_students} />
                    <StatCard icon={CheckCircle2} label="Students Placed" value={data.students_placed} />
                    <StatCard icon={TrendingUp} label="Placement Rate" value={`${data.placement_rate}%`} />
                    <StatCard icon={Briefcase} label="Jobs Posted" value={data.total_jobs} />
                    <StatCard icon={FileText} label="Applications" value={data.total_applications} />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-8 shadow-sm">
                        <SectionHeader icon={BarChart3} title="Placement Probability Distribution" />
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={probData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" vertical={false} />
                                <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#6b6b66' }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b6b66' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f0ee' }} />
                                <Bar dataKey="students" name="Students" radius={[4, 4, 0, 0]}>
                                    {probData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-8 shadow-sm">
                        <SectionHeader icon={GraduationCap} title="Students by Readiness Level" />
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={readinessData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    labelLine={false}
                                >
                                    {readinessData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-8 shadow-sm">
                        <SectionHeader icon={Users} title="Department Performance" />
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={deptChartData} barSize={24}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b6b66' }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b6b66' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f0ee' }} />
                                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                                <Bar dataKey="total" name="Total" fill="#d0cfcb" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="placed" name="Placed" fill="#1a1a18" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-8 shadow-sm">
                        <SectionHeader icon={AlertTriangle} title="Domain Skill Gaps" />
                        <div className="space-y-6 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                            {(data.domain_skill_gaps || []).map((dg, idx) => (
                                <div key={idx}>
                                    <p className="text-sm font-bold text-[#1a1a18] uppercase tracking-wider mb-3">{dg.domain}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {dg.missing.map((m, i) => (
                                            <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-[#e6e5e1] text-[#4a4a46] font-bold border border-[#e0dfdb]">
                                                {m.skill} <span className="opacity-60 ml-1">({m.count})</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {(!data.domain_skill_gaps || data.domain_skill_gaps.length === 0) && (
                                <p className="text-sm text-[#8a8a84] font-medium pt-12 text-center">No skill gap data available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Risk Indicators */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-8 shadow-sm">
                        <SectionHeader icon={AlertTriangle} title="Low Probability Students" />
                        <div className="max-h-[260px] overflow-y-auto pr-2">
                            {data.low_probability_students?.length > 0 ? (
                                data.low_probability_students.map((s, i) => (
                                    <RiskRow key={i} name={s.name} dept={s.department} detail={`${s.probability}%`} severity="high" />
                                ))
                            ) : (
                                <p className="text-sm font-medium text-[#8a8a84] py-8 text-center">All students above threshold.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-8 shadow-sm">
                        <SectionHeader icon={Briefcase} title="No Internship Experience" />
                        <div className="max-h-[260px] overflow-y-auto pr-2">
                            {data.no_internship_students?.length > 0 ? (
                                data.no_internship_students.map((s, i) => (
                                    <RiskRow key={i} name={s.name} dept={s.department} detail="No internships" severity="medium" />
                                ))
                            ) : (
                                <p className="text-sm font-medium text-[#8a8a84] py-8 text-center">All students have internship experience.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] p-8 shadow-sm">
                        <SectionHeader icon={GraduationCap} title="Below CGPA Threshold (6.0)" />
                        <div className="max-h-[260px] overflow-y-auto pr-2">
                            {data.below_cgpa_students?.length > 0 ? (
                                data.below_cgpa_students.map((s, i) => (
                                    <RiskRow key={i} name={s.name} dept={s.department} detail={`CGPA: ${s.cgpa}`} severity="high" />
                                ))
                            ) : (
                                <p className="text-sm font-medium text-[#8a8a84] py-8 text-center">All students above threshold.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Department Table */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] overflow-hidden shadow-sm">
                    <div className="px-8 py-6 border-b border-[#e0dfdb]">
                        <SectionHeader icon={BarChart3} title="Department-wise Breakdown" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f0f0ee]">
                                <tr>
                                    <th className="px-8 py-4 text-xs font-bold text-[#8a8a84] uppercase tracking-widest">Department</th>
                                    <th className="px-8 py-4 text-xs font-bold text-[#8a8a84] uppercase tracking-widest">Total</th>
                                    <th className="px-8 py-4 text-xs font-bold text-[#8a8a84] uppercase tracking-widest">Placed</th>
                                    <th className="px-8 py-4 text-xs font-bold text-[#8a8a84] uppercase tracking-widest text-right">Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e0dfdb]">
                                {data.departments.map((dept, idx) => {
                                    const rate = dept.total_students ? Math.round((dept.placed_students / dept.total_students) * 100) : 0;
                                    return (
                                        <tr key={idx} className="hover:bg-white/80 transition-colors">
                                            <td className="px-8 py-5 font-bold text-[#1a1a18]">{dept.department}</td>
                                            <td className="px-8 py-5 font-medium text-[#6b6b66]">{dept.total_students}</td>
                                            <td className="px-8 py-5 font-medium text-[#6b6b66]">{dept.placed_students}</td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-4">
                                                    <span className="text-sm font-bold text-[#1a1a18]">{rate}%</span>
                                                    <div className="w-24 h-2 bg-[#e6e5e1] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-[#1a1a18]"
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
