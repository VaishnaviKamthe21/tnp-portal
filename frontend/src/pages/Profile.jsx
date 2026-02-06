import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Calendar, GraduationCap, Code, Briefcase, FileText, Loader2, Save } from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import { getProfile, updateProfile } from '../services/student';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        department: '',
        batch_year: new Date().getFullYear(),
        cgpa: '',
        skills: '',
        internships: 0,
        coding_score: '',
        aptitude_score: '',
        resume_link: ''
    });

    const user = getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            if (user.role === 'admin') {
                setLoading(false);
                return;
            }

            try {
                const profile = await getProfile(user.id);
                setFormData({
                    full_name: profile.full_name || '',
                    department: profile.department || '',
                    batch_year: profile.batch_year || new Date().getFullYear(),
                    cgpa: profile.cgpa || '',
                    skills: profile.skills || '',
                    internships: profile.internships || 0,
                    coding_score: profile.coding_score || '',
                    aptitude_score: profile.aptitude_score || '',
                    resume_link: profile.resume_link || ''
                });
            } catch (err) {
                if (err.response?.status !== 404) {
                    setError('Failed to load profile data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, navigate]);

    // ... handle logout or change role behavior if needed

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await updateProfile({
                ...formData,
                user_id: user.id
            });
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile. Please check your details.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'batch_year' || name === 'internships' ? parseInt(value) || 0 : value
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (user?.role === 'admin') {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-10 text-white">
                        <h1 className="text-3xl font-bold mb-2">Admin Account</h1>
                        <p className="text-slate-300">Campus Placement Administrator</p>
                    </div>
                    <div className="p-8 md:p-10">
                        <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <User className="w-10 h-10 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{user.email}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">
                                        {user.role}
                                    </span>
                                    <span className="text-gray-400 text-sm">• Active Session</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white border border-gray-100 rounded-2xl">
                                <h4 className="font-bold text-gray-900 mb-2">System Privileges</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        Access Placement Analytics
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        Manage Job Applications
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        Mark Student Placement Status
                                    </li>
                                </ul>
                            </div>
                            <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex flex-col justify-center">
                                <p className="text-blue-800 font-medium mb-4 text-center">Ready to check the numbers?</p>
                                <button
                                    onClick={() => navigate('/admin/dashboard')}
                                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-10 text-white">
                    <h1 className="text-3xl font-bold mb-2">Student Profile</h1>
                    <p className="text-blue-100">Please provide your details for better job recommendations</p>
                </div>

                <div className="p-8 md:p-10">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 text-sm rounded-xl">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" /> Department
                                </label>
                                <input
                                    type="text"
                                    name="department"
                                    required
                                    placeholder="e.g. CSE, IT, ENTC"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.department}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Academic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Batch Year
                                </label>
                                <input
                                    type="number"
                                    name="batch_year"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.batch_year}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" /> CGPA
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="cgpa"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.cgpa}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" /> Internships
                                </label>
                                <input
                                    type="number"
                                    name="internships"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.internships}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Scores & Skills */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Code className="w-4 h-4" /> Skills
                                </label>
                                <textarea
                                    name="skills"
                                    rows="3"
                                    placeholder="e.g. React, Python, Node.js (comma separated)"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.skills}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Coding Score (0-100)</label>
                                    <input
                                        type="number"
                                        name="coding_score"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={formData.coding_score}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Aptitude Score (0-100)</label>
                                    <input
                                        type="number"
                                        name="aptitude_score"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={formData.aptitude_score}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Link */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Resume Link
                            </label>
                            <input
                                type="url"
                                name="resume_link"
                                placeholder="https://drive.google.com/..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.resume_link}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Profile Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
