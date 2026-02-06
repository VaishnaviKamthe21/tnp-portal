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
        // Clear errors when user types
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Basic validation
        if (!formData.company || !formData.title || !formData.min_cgpa) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            await createJob(formData);
            setSuccess('Job posted successfully!');
            // Reset form
            setFormData({
                company: '',
                title: '',
                description: '',
                min_cgpa: '',
                required_skills: ''
            });
            // Optional: Redirect after delay
            setTimeout(() => {
                navigate('/student/jobs'); // Or stay here to post more
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
                <p className="text-gray-500">Create a new job opening for students to apply.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-700">Job Details</span>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-600">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium">{success}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="e.g. Google, Amazon"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                                required
                            />
                        </div>

                        {/* Job Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Software Engineer"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the role, responsibilities, and perks..."
                            rows="4"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Min CGPA */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-gray-400" />
                                Minimum CGPA <span className="text-red-500">*</span>
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
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                                required
                            />
                        </div>

                        {/* Required Skills */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-gray-400" />
                                Required Skills
                            </label>
                            <input
                                type="text"
                                name="required_skills"
                                value={formData.required_skills}
                                onChange={handleChange}
                                placeholder="e.g. React, Python, SQL (comma separated)"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
