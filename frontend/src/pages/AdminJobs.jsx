import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Building2,
    FileText,
    GraduationCap,
    Code2,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { createJob } from '../services/jobs';

const AdminJobs = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        company: '',
        title: '',
        description: '',
        min_cgpa: '',
        required_skills: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!formData.company || !formData.title || !formData.min_cgpa) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            await createJob(formData);
            setSuccess('Job posted successfully!');
            setFormData({
                company: '',
                title: '',
                description: '',
                min_cgpa: '',
                required_skills: ''
            });
            setTimeout(() => {
                navigate('/student/jobs');
            }, 2000);
        } catch (err) {
            console.error('Error posting job:', err);
            setError('Failed to post job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#1a1a18] mb-1 tracking-tight">Post a New Job</h1>
                <p className="text-[#8a8a84] text-sm font-medium">Create a new job opening for students to apply.</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e0dfdb] overflow-hidden shadow-sm">
                <div className="bg-[#f0f0ee] px-8 py-5 border-b border-[#e0dfdb] flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a1a18] rounded-xl flex items-center justify-center shadow-md">
                        <Briefcase className="w-5 h-5 text-[#f0f0ee]" />
                    </div>
                    <span className="font-bold text-[#1a1a18] tracking-wider uppercase text-sm">Job Details</span>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-600 font-medium">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700 font-medium">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{success}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#4a4a46] flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-[#a0a09b]" />
                                Company Name <span className="text-[#1a1a18]">*</span>
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="e.g. Google, Amazon"
                                className="w-full px-4 py-3 rounded-lg border border-[#e0dfdb] focus:border-[#1a1a18] focus:ring-2 focus:ring-[#1a1a18] transition-all outline-none text-sm bg-[#f0f0ee] text-[#1a1a18] font-medium placeholder-[#a0a09b]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#4a4a46] flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-[#a0a09b]" />
                                Job Title <span className="text-[#1a1a18]">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Software Engineer"
                                className="w-full px-4 py-3 rounded-lg border border-[#e0dfdb] focus:border-[#1a1a18] focus:ring-2 focus:ring-[#1a1a18] transition-all outline-none text-sm bg-[#f0f0ee] text-[#1a1a18] font-medium placeholder-[#a0a09b]"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#4a4a46] flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#a0a09b]" />
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the role, responsibilities, and perks..."
                            rows="4"
                            className="w-full px-4 py-3 rounded-lg border border-[#e0dfdb] focus:border-[#1a1a18] focus:ring-2 focus:ring-[#1a1a18] transition-all outline-none resize-none text-sm bg-[#f0f0ee] text-[#1a1a18] font-medium placeholder-[#a0a09b]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#4a4a46] flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-[#a0a09b]" />
                                Minimum CGPA <span className="text-[#1a1a18]">*</span>
                            </label>
                            <input
                                type="number"
                                name="min_cgpa"
                                value={formData.min_cgpa}
                                onChange={handleChange}
                                placeholder="e.g. 7.5"
                                step="0.1"
                                min="0"
                                max="10"
                                className="w-full px-4 py-3 rounded-lg border border-[#e0dfdb] focus:border-[#1a1a18] focus:ring-2 focus:ring-[#1a1a18] transition-all outline-none text-sm bg-[#f0f0ee] text-[#1a1a18] font-medium placeholder-[#a0a09b]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#4a4a46] flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-[#a0a09b]" />
                                Required Skills
                            </label>
                            <input
                                type="text"
                                name="required_skills"
                                value={formData.required_skills}
                                onChange={handleChange}
                                placeholder="e.g. React, Python, SQL (comma separated)"
                                className="w-full px-4 py-3 rounded-lg border border-[#e0dfdb] focus:border-[#1a1a18] focus:ring-2 focus:ring-[#1a1a18] transition-all outline-none text-sm bg-[#f0f0ee] text-[#1a1a18] font-medium placeholder-[#a0a09b]"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1a1a18] text-[#f0f0ee] font-bold py-3.5 rounded-lg hover:bg-black hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                'Post Job'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminJobs;
