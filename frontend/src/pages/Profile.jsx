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
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#8a8a84]" />
            </div>
        );
    }

    if (user?.role === 'admin') {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-[#e0dfdb] overflow-hidden shadow-sm">
                    <div className="bg-[#111110] px-8 py-10 text-[#f0f0ee]">
                        <h1 className="text-3xl font-extrabold mb-1 tracking-tight">Admin Account</h1>
                        <p className="text-[#a0a09b] text-sm">Campus Placement Administrator</p>
                    </div>
                    <div className="p-8 md:p-10">
                        <div className="flex items-center gap-6 mb-10 p-6 bg-[#f0f0ee] rounded-xl border border-[#e0dfdb]">
                            <div className="w-16 h-16 bg-[#e6e5e1] rounded-xl flex items-center justify-center">
                                <User className="w-8 h-8 text-[#6b6b66]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#1a1a18]">{user.email}</h3>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="px-2.5 py-1 bg-[#1a1a18] text-[#f0f0ee] text-xs font-semibold rounded uppercase tracking-wider">
                                        {user.role}
                                    </span>
                                    <span className="text-[#8a8a84] text-sm font-medium">Active Session</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-7 bg-white border border-[#e0dfdb] rounded-xl shadow-sm">
                                <h4 className="font-bold text-[#1a1a18] mb-4 text-sm uppercase tracking-wider">System Privileges</h4>
                                <ul className="space-y-3 text-sm text-[#4a4a46] font-medium">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#1a1a18] rounded-full" />
                                        Access Placement Analytics
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#1a1a18] rounded-full" />
                                        Manage Job Applications
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#1a1a18] rounded-full" />
                                        Mark Student Placement Status
                                    </li>
                                </ul>
                            </div>
                            <div className="p-7 bg-[#f0f0ee] border border-[#e0dfdb] rounded-xl flex flex-col justify-center items-center text-center">
                                <p className="text-[#4a4a46] font-medium mb-5 text-sm">Ready to check the numbers?</p>
                                <button
                                    onClick={() => navigate('/admin/dashboard')}
                                    className="w-full py-3 bg-[#1a1a18] text-[#f0f0ee] font-medium rounded-lg hover:bg-black transition-colors text-sm shadow-md"
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
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-[#e0dfdb] overflow-hidden shadow-sm">
                <div className="bg-[#111110] px-8 py-10 text-[#f0f0ee]">
                    <h1 className="text-3xl font-extrabold mb-1 tracking-tight">Student Profile</h1>
                    <p className="text-[#a0a09b] text-sm">Please provide your details for better job recommendations</p>
                </div>

                <div className="p-8 md:p-10">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-7">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-[#4a4a46] mb-2 flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#a0a09b]" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    required
                                    className="w-full px-4 py-3 bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg focus:ring-2 focus:ring-[#1a1a18] focus:border-[#1a1a18] focus:bg-white/90 outline-none transition-all text-sm text-[#1a1a18]"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#4a4a46] mb-2 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-[#a0a09b]" /> Department
                                </label>
                                <input
                                    type="text"
                                    name="department"
                                    required
                                    placeholder="e.g. CSE, IT, ENTC"
                                    className="w-full px-4 py-3 bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg focus:ring-2 focus:ring-[#1a1a18] focus:border-[#1a1a18] focus:bg-white/90 outline-none transition-all text-sm text-[#1a1a18]"
                                    value={formData.department}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Academic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-[#4a4a46] mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#a0a09b]" /> Batch Year
                                </label>
                                <input
                                    type="number"
                                    name="batch_year"
                                    required
                                    className="w-full px-4 py-3 bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg focus:ring-2 focus:ring-[#1a1a18] focus:border-[#1a1a18] focus:bg-white/90 outline-none transition-all text-sm text-[#1a1a18]"
                                    value={formData.batch_year}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#4a4a46] mb-2 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-[#a0a09b]" /> CGPA
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="cgpa"
                                    required
                                    className="w-full px-4 py-3 bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg focus:ring-2 focus:ring-[#1a1a18] focus:border-[#1a1a18] focus:bg-white/90 outline-none transition-all text-sm text-[#1a1a18]"
                                    value={formData.cgpa}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#4a4a46] mb-2 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-[#a0a09b]" /> Internships
                                </label>
                                <input
                                    type="number"
                                    name="internships"
                                    className="w-full px-4 py-3 bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg focus:ring-2 focus:ring-[#1a1a18] focus:border-[#1a1a18] focus:bg-white/90 outline-none transition-all text-sm text-[#1a1a18]"
                                    value={formData.internships}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Scores & Skills */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-[#4a4a46] mb-2 flex items-center gap-2">
                                    <Code className="w-4 h-4 text-[#a0a09b]" /> Skills
                                </label>
                                <textarea
                                    name="skills"
                                    rows="3"
                                    placeholder="e.g. React, Python, Node.js (comma separated)"
                                    className="w-full px-4 py-3 bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg focus:ring-2 focus:ring-[#1a1a18] focus:border-[#1a1a18] focus:bg-white/90 outline-none transition-all text-sm text-[#1a1a18]"
                                    value={formData.skills}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-[#4a4a46] mb-2">Coding Score (0-100)</label>
                                    <input
                                        type="number"
                                        name="coding_score"
                                        className="w-full px-4 py-3 bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg focus:ring-2 focus:ring-[#1a1a18] focus:border-[#1a1a18] focus:bg-white/90 outline-none transition-all text-sm text-[#1a1a18]"
                                        value={formData.coding_score}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4a4a46] mb-2">Aptitude Score (0-100)</label>
                                    <input
                                        type="number"
                                        name="aptitude_score"
                                        className="w-full px-4 py-3 bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg focus:ring-2 focus:ring-[#1a1a18] focus:border-[#1a1a18] focus:bg-white/90 outline-none transition-all text-sm text-[#1a1a18]"
                                        value={formData.aptitude_score}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Link */}
                        <div>
                            <label className="block text-sm font-medium text-[#4a4a46] mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#a0a09b]" /> Resume Link
                            </label>
                            <input
                                type="url"
                                name="resume_link"
                                placeholder="https://drive.google.com/..."
                                className="w-full px-4 py-3 bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg focus:ring-2 focus:ring-[#1a1a18] focus:border-[#1a1a18] focus:bg-white/90 outline-none transition-all text-sm text-[#1a1a18]"
                                value={formData.resume_link}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1a1a18] text-[#f0f0ee] font-medium rounded-lg hover:bg-black hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Profile
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
