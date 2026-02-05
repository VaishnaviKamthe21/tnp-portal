import { useState, useEffect } from 'react';
import {
    Clock,
    CheckCircle2,
    Briefcase,
    ExternalLink,
    Loader2,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import { getStudentApplications } from '../services/jobs';
import { getJobs } from '../services/jobs';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState({}); // Map of job_id -> job details
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

                // Create a map of jobs for easy lookup
                const jobMap = {};
                allJobs.forEach(job => {
                    jobMap[job.id] = job;
                });

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
                <p className="text-gray-500">Track the status of your submitted job applications.</p>
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
                        <div key={app.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-blue-500/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-100 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Briefcase className="w-7 h-7 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                    <p className="text-gray-500 text-sm font-medium mb-2">{job.company}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Applied on {new Date().toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                                <div className="flex flex-col items-end">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${app.status === 'offered'
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Under Review
                                    </span>
                                </div>
                                <button className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                    <ExternalLink className="w-5 h-5" />
                                </button>
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
