import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs, applyToJob } from '../services/jobs';
import { getCurrentUser } from '../services/auth';
import JobCard from '../components/JobCard';

const StudentJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getJobs();
                setJobs(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleApply = async (jobId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        return applyToJob(jobId, user.id);
    };

    if (loading) {
        return <div className="min-h-[calc(100vh-64px)] flex items-center justify-center text-[#8a8a84] font-medium">Loading jobs...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-extrabold text-[#1a1a18] mb-8 tracking-tight">Available Opportunities</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} onApply={() => handleApply(job.id)} userId={user?.id} />
                ))}
            </div>
            {jobs.length === 0 && (
                <div className="text-center py-20 bg-white/70 rounded-2xl border border-dashed border-[#e0dfdb]">
                    <p className="text-[#8a8a84] font-medium">No jobs found. Check back later!</p>
                </div>
            )}
        </div>
    );
};

export default StudentJobs;
