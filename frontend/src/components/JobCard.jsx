import { useState } from 'react';
import { MapPin, Building2, GraduationCap, Clock, Loader2, CheckCircle } from 'lucide-react';

const JobCard = ({ job, onApply, userId = 1 }) => {
    const [isApplying, setIsApplying] = useState(false);
    const [applied, setApplied] = useState(false);

    const handleApply = async () => {
        if (applied || isApplying) return;

        setIsApplying(true);
        try {
            await onApply(job.id, userId);
            setApplied(true);
        } catch (error) {
            console.error('Failed to apply:', error);
            alert('Failed to apply. Please try again.');
        } finally {
            setIsApplying(false);
        }
    };

    // Parse skills - handle both string and array formats
    const skills = Array.isArray(job.required_skills)
        ? job.required_skills
        : job.required_skills?.split(',').map(s => s.trim()) || [];

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between gap-4">
                    {/* Company Logo Placeholder */}
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                        <Building2 className="w-7 h-7 text-white" />
                    </div>

                    {/* Job Type Badge */}
                    <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                        Full Time
                    </span>
                </div>

                {/* Job Info */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                    </h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location || 'Remote'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4" />
                        <span>Min CGPA: {job.min_cgpa}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>Posted recently</span>
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="px-6 py-4 border-t border-gray-50">
                <div className="flex flex-wrap gap-2">
                    {skills.slice(0, 4).map((skill, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full"
                        >
                            {skill}
                        </span>
                    ))}
                    {skills.length > 4 && (
                        <span className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                            +{skills.length - 4} more
                        </span>
                    )}
                </div>
            </div>

            {/* Description Preview */}
            {job.description && (
                <div className="px-6 py-3 border-t border-gray-50">
                    <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50/50 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    {job.applicants_count ? `${job.applicants_count} applicants` : 'Be the first to apply'}
                </div>
                <button
                    onClick={handleApply}
                    disabled={isApplying || applied}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${applied
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : isApplying
                                ? 'bg-gray-100 text-gray-400 cursor-wait'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-800'
                        }`}
                >
                    {applied ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Applied
                        </>
                    ) : isApplying ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Applying...
                        </>
                    ) : (
                        'Apply Now'
                    )}
                </button>
            </div>
        </div>
    );
};

export default JobCard;
