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

    const skills = Array.isArray(job.required_skills)
        ? job.required_skills
        : job.required_skills?.split(',').map(s => s.trim()) || [];

    return (
        <div className="group bg-white/70 rounded-xl border border-[#e0dfdb] hover:border-[#d0cfcb] hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300 overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="w-11 h-11 bg-[#1a1a18] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-[#f0f0ee]" />
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold text-[#6b6b66] bg-[#e6e5e1] rounded-full uppercase tracking-widest">
                        Full Time
                    </span>
                </div>

                <div className="mt-5">
                    <h3 className="text-lg font-bold text-[#1a1a18] group-hover:text-black transition-colors">
                        {job.title}
                    </h3>
                    <p className="text-[#8a8a84] text-sm mt-1">{job.company}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-[#8a8a84]">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#a0a09b]" />
                        <span>{job.location || 'Remote'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-[#a0a09b]" />
                        <span>Min CGPA: {job.min_cgpa}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#a0a09b]" />
                        <span>Posted recently</span>
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="px-6 py-4 border-t border-[#e0dfdb]/60">
                <div className="flex flex-wrap gap-2">
                    {skills.slice(0, 4).map((skill, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium text-[#4a4a46] bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg"
                        >
                            {skill}
                        </span>
                    ))}
                    {skills.length > 4 && (
                        <span className="px-3 py-1 text-xs font-medium text-[#a0a09b] bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg">
                            +{skills.length - 4} more
                        </span>
                    )}
                </div>
            </div>

            {/* Description Preview */}
            {job.description && (
                <div className="px-6 py-4 border-t border-[#e0dfdb]/60 bg-[#f0f0ee]/50">
                    <p className="text-sm text-[#6b6b66] line-clamp-2 leading-relaxed">{job.description}</p>
                </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 bg-[#f0f0ee]/80 flex items-center justify-between border-t border-[#e0dfdb]/60">
                <div className="text-[13px] font-medium text-[#8a8a84]">
                    {job.applicants_count ? `${job.applicants_count} applicants` : 'Be the first to apply'}
                </div>
                <button
                    onClick={handleApply}
                    disabled={isApplying || applied}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${applied
                            ? 'bg-[#e6e5e1] text-[#6b6b66] cursor-default'
                            : isApplying
                                ? 'bg-[#e6e5e1] text-[#a0a09b] cursor-wait'
                                : 'bg-[#1a1a18] text-[#f0f0ee] hover:bg-black hover:shadow-md'
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
