import { useState, useEffect } from 'react';
import {
    Users,
    Briefcase,
    CheckCircle2,
    Loader2,
    AlertCircle,
    GraduationCap,
    Building2,
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
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#8a8a84]" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-[#1a1a18] rounded-xl flex items-center justify-center shadow-md">
                        <Users className="w-6 h-6 text-[#f0f0ee]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1a1a18] tracking-tight">Applicants Management</h1>
                        <p className="text-[#8a8a84] font-medium text-sm mt-1">Review candidates and manage placement status securely</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider">
                    <div className="px-4 py-2.5 bg-white/70 backdrop-blur-sm rounded-lg border border-[#e0dfdb]">
                        <span className="text-[#1a1a18] text-base">{jobs.length}</span>
                        <span className="text-[#8a8a84] ml-2 font-medium">Job Opportunities</span>
                    </div>
                    <div className="px-4 py-2.5 bg-white/70 backdrop-blur-sm rounded-lg border border-[#e0dfdb]">
                        <span className="text-[#1a1a18] text-base">{applications.length}</span>
                        <span className="text-[#8a8a84] ml-2 font-medium">Total Applications</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {jobs.length > 0 ? (
                <div className="space-y-4 text-left">
                    {jobs.map((job) => {
                        const applicants = getApplicantsForJob(job.id);
                        const isExpanded = expandedJob === job.id;

                        return (
                            <div
                                key={job.id}
                                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] overflow-hidden hover:border-[#d0cfcb] transition-all shadow-sm"
                            >
                                <div
                                    className="p-7 cursor-pointer"
                                    onClick={() => toggleJobExpansion(job.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start gap-5 flex-1">
                                            <div className="w-14 h-14 bg-[#e6e5e1] rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="w-7 h-7 text-[#4a4a46]" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-[#1a1a18] mb-1.5">
                                                    {job.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-[#8a8a84] font-medium text-sm mb-3">
                                                    <Building2 className="w-4 h-4" />
                                                    <span>{job.company}</span>
                                                </div>
                                                <div className="flex items-center gap-5 text-sm uppercase tracking-wider font-bold">
                                                    <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg">
                                                        <Users className="w-4 h-4 text-[#8a8a84]" />
                                                        <span className="text-[#1a1a18]">{applicants.length}</span>
                                                        <span className="text-[#8a8a84] font-medium">Applicants</span>
                                                    </div>
                                                    {job.min_cgpa && (
                                                        <span className="text-[#6b6b66] border border-[#e0dfdb] bg-white px-3 py-1.5 rounded-lg border-dashed">Min CGPA: {job.min_cgpa}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-4 shrink-0 px-4">
                                            {isExpanded ? (
                                                <ChevronUp className="w-6 h-6 text-[#1a1a18]" />
                                            ) : (
                                                <ChevronDown className="w-6 h-6 text-[#8a8a84]" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-[#e0dfdb] bg-[#f0f0ee]/50">
                                        {applicants.length > 0 ? (
                                            <div className="p-7 space-y-3">
                                                {applicants.map((app) => {
                                                    const student = students[app.student_id] || {};
                                                    return (
                                                        <div
                                                            key={app.id}
                                                            className="bg-white rounded-xl p-5 border border-[#e0dfdb] flex items-center justify-between hover:shadow-sm hover:border-[#d0cfcb] transition-all"
                                                        >
                                                            <div className="flex items-center gap-5">
                                                                <div className="w-12 h-12 bg-[#e6e5e1] rounded-xl flex items-center justify-center">
                                                                    <GraduationCap className="w-6 h-6 text-[#4a4a46]" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-[#1a1a18]">
                                                                        {student.full_name || 'Unknown Student'}
                                                                    </h4>
                                                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8a8a84] mt-1.5 mb-1">
                                                                        <span className="bg-[#f0f0ee] px-2 py-0.5 rounded">ID: {app.student_id}</span>
                                                                        <span className="bg-[#f0f0ee] px-2 py-0.5 rounded">APP: {app.id}</span>
                                                                    </div>
                                                                    {student.department && (
                                                                        <p className="text-xs font-medium text-[#6b6b66]">
                                                                            {student.department} {student.cgpa && `— CGPA: ${student.cgpa}`}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleMarkPlaced(student.user_id)}
                                                                disabled={placingStudent === student.user_id}
                                                                className="px-6 py-2.5 bg-[#1a1a18] text-[#f0f0ee] font-bold uppercase tracking-wider rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-xs"
                                                            >
                                                                {placingStudent === student.user_id ? (
                                                                    <>
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                        Marking...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <UserCheck className="w-4 h-4" />
                                                                        Mark Placed
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-10 text-center">
                                                <Users className="w-12 h-12 text-[#d0cfcb] mx-auto mb-3" />
                                                <p className="text-[#8a8a84] font-medium text-sm">No applicants yet for this job position.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-24 bg-white/70 backdrop-blur-sm rounded-2xl border border-dashed border-[#d0cfcb]">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-[#e6e5e1] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                            <Briefcase className="w-8 h-8 text-[#6b6b66]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1a1a18] mb-2">No Jobs Posted Yet</h3>
                        <p className="text-[#8a8a84] font-medium text-sm">
                            Post jobs to start receiving applications from students.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantsManagement;
