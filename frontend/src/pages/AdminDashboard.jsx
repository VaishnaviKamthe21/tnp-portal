import { useState, useEffect } from 'react';
import {
    Users,
    Briefcase,
    BarChart3,
    CheckCircle2,
    TrendingUp,
    AlertCircle,
    Loader2
} from 'lucide-react';
import {
    getDepartmentSummary,
    getPlacementRate,
    getJobCount
} from '../services/admin';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total_jobs: 0,
        placement_rate: 0,
        departments: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [jobs, rate, depts] = await Promise.all([
                    getJobCount().catch(() => ({ total_jobs: 0 })),
                    getPlacementRate().catch(() => ({ placement_rate: 0 })),
                    getDepartmentSummary().catch(() => [])
                ]);

                setStats({
                    total_jobs: jobs.total_jobs || 0,
                    placement_rate: rate.placement_rate || 0,
                    departments: Array.isArray(depts) ? depts : []
                });
            } catch (err) {
                console.error('Failed to fetch admin stats:', err);
                setError('Some features might be unavailable. Please check backend connection.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Crunching dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Placement Analytics</h1>
                    <p className="text-gray-500">Overview of campus placement performance and department metrics.</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-700">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Briefcase className="w-24 h-24" />
                        </div>
                        <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Total Active Jobs</p>
                        <div className="flex items-end gap-3">
                            <h2 className="text-4xl font-bold text-gray-900">{stats.total_jobs}</h2>
                            <span className="text-green-500 text-sm font-semibold mb-1 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                Live
                            </span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-green-500/5 border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <CheckCircle2 className="w-24 h-24" />
                        </div>
                        <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Overall Placement Rate</p>
                        <div className="flex items-end gap-3">
                            <h2 className="text-4xl font-bold text-gray-900">{stats.placement_rate}%</h2>
                            <div className="w-24 h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${stats.placement_rate}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-purple-500/5 border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Users className="w-24 h-24" />
                        </div>
                        <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Departments Tracked</p>
                        <div className="flex items-end gap-3">
                            <h2 className="text-4xl font-bold text-gray-900">{stats.departments.length}</h2>
                            <BarChart3 className="w-8 h-8 text-purple-500 mb-1" />
                        </div>
                    </div>
                </div>

                {/* Department Summary Table */}
                <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Department-wise Breakdown</h2>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            Export Report
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Students</th>
                                    <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Placed</th>
                                    <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Placement Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.departments.length > 0 ? stats.departments.map((dept, idx) => {
                                    const rate = dept.total_students ? Math.round((dept.placed_students / dept.total_students) * 100) : 0;
                                    return (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-5 font-semibold text-gray-900">{dept.department}</td>
                                            <td className="px-8 py-5 text-gray-600">{dept.total_students}</td>
                                            <td className="px-8 py-5 text-gray-600">{dept.placed_students}</td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center justify-end gap-4">
                                                    <span className="text-sm font-bold text-gray-900">{rate}%</span>
                                                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ${rate > 75 ? 'bg-green-500' : rate > 40 ? 'bg-blue-500' : 'bg-amber-500'
                                                                }`}
                                                            style={{ width: `${rate}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="max-w-xs mx-auto">
                                                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500">No department data found. Ensure students have profiles.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
