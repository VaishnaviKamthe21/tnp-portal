import { useState, useEffect } from 'react';
import {
    Users,
    Briefcase,
    CheckCircle2,
    Loader2,
    AlertCircle,
    GraduationCap,
    Building2,
    Award,
    ChevronDown,
    ChevronUp,
    UserCheck
} from 'lucide-react';
import { getAllApplications, markPlaced } from '../services/admin';
import { getJobs } from '../services/jobs';
import { getAllStudents } from '../services/student';

const ApplicantsManagement = () => {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [students, setStudents] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedJob, setExpandedJob] = useState(null);
    const [placingStudent, setPlacingStudent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [apps, allJobs, allStudents] = await Promise.all([
                    getAllApplications(),
                    getJobs(),
                    getAllStudents()
                ]);

                // Create student lookup map by profile ID
                const studentMap = {};
                allStudents.forEach(student => {
                    studentMap[student.id] = student;
                });

                setJobs(Array.isArray(allJobs) ? allJobs : []);
                setApplications(Array.isArray(apps) ? apps : []);
                setStudents(studentMap);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load applications.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getApplicantsForJob = (jobId) => {
        return applications.filter(app => app.job_id === jobId);
    };

    const handleMarkPlaced = async (studentId) => {
        setPlacingStudent(studentId);
        try {
            await markPlaced(studentId);
            alert('Student marked as placed successfully!');
        } catch (err) {
            console.error('Error marking student as placed:', err);
            alert('Failed to mark student as placed.');
        } finally {
            setPlacingStudent(null);
        }
    };

    const toggleJobExpansion = (jobId) => {
        setExpandedJob(expandedJob === jobId ? null : jobId);
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Applicants Management</h1>
                        <p className="text-gray-500">View applicants by job opportunity</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                        <span className="text-blue-600 font-bold">{jobs.length}</span>
                        <span className="text-gray-600 ml-1">Job Opportunities</span>
                    </div>
                    <div className="px-4 py-2 bg-green-50 rounded-xl border border-green-100">
                        <span className="text-green-600 font-bold">{applications.length}</span>
                        <span className="text-gray-600 ml-1">Total Applications</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {jobs.length > 0 ? (
                <div className="space-y-4">
                    {jobs.map((job) => {
                        const applicants = getApplicantsForJob(job.id);
                        const isExpanded = expandedJob === job.id;

                        return (
                            <div
                                key={job.id}
                                className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-500/5 overflow-hidden hover:border-blue-100 transition-all"
                            >
                                {/* Job Card Header */}
                                <div
                                    className="p-6 cursor-pointer"
                                    onClick={() => toggleJobExpansion(job.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                    {job.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                    <Building2 className="w-4 h-4" />
                                                    <span className="font-medium">{job.company}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                                                        <Users className="w-4 h-4 text-blue-600" />
                                                        <span className="text-blue-600 font-bold">{applicants.length}</span>
                                                        <span className="text-gray-600">Applicants</span>
                                                    </div>
                                                    {job.min_cgpa && (
                                                        <span className="text-gray-400">Min CGPA: {job.min_cgpa}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            {isExpanded ? (
                                                <ChevronUp className="w-6 h-6 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Applicants List (Expandable) */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50">
                                        {applicants.length > 0 ? (
                                            <div className="p-6 space-y-3">
                                                {applicants.map((app) => {
                                                    const student = students[app.student_id] || {};
                                                    return (
                                                        <div
                                                            key={app.id}
                                                            className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between hover:border-blue-100 transition-all"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                                                    <GraduationCap className="w-6 h-6 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-gray-900">
                                                                        {student.full_name || 'Unknown Student'}
                                                                    </h4>
                                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                        <span>Student ID: {app.student_id}</span>
                                                                        <span className="text-gray-300">•</span>
                                                                        <span>Application ID: {app.id}</span>
                                                                    </div>
                                                                    {student.department && (
                                                                        <p className="text-xs text-gray-400 mt-1">
                                                                            {student.department} {student.cgpa && `• CGPA: ${student.cgpa}`}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleMarkPlaced(app.student_id)}
                                                                disabled={placingStudent === app.student_id}
                                                                className="px-5 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                                                            >
                                                                {placingStudent === app.student_id ? (
                                                                    <>
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                        Marking...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <UserCheck className="w-4 h-4" />
                                                                        Mark as Placed
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500 text-sm">No applicants yet for this job</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No Jobs Posted Yet</h3>
                        <p className="text-gray-500 text-sm">
                            Post jobs to start receiving applications from students.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantsManagement;
