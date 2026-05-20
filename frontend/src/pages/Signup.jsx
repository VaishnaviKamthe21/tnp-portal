import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { signup } from '../services/auth';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signup(email, password, role);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-[#e0dfdb] p-8 md:p-10">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-[#1a1a18] mb-2">Create Account</h2>
                        <p className="text-[#8a8a84] text-sm">Start your journey with CampusHire today</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
                            Account created successfully! Redirecting to login...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[#4a4a46] mb-2">
                                I am a
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={`py-3 px-4 rounded-lg text-sm font-medium border transition-all ${role === 'student'
                                            ? 'bg-[#1a1a18] border-[#1a1a18] text-[#f0f0ee] shadow-md'
                                            : 'bg-[#f0f0ee] border-[#e0dfdb] text-[#8a8a84] hover:bg-white hover:text-[#4a4a46]'
                                        }`}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('admin')}
                                    className={`py-3 px-4 rounded-lg text-sm font-medium border transition-all ${role === 'admin'
                                            ? 'bg-[#1a1a18] border-[#1a1a18] text-[#f0f0ee] shadow-md'
                                            : 'bg-[#f0f0ee] border-[#e0dfdb] text-[#8a8a84] hover:bg-white hover:text-[#4a4a46]'
                                        }`}
                                >
                                    Recruiter/Admin
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#4a4a46] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-[#a0a09b]" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg focus:ring-2 focus:ring-[#1a1a18] focus:border-[#1a1a18] focus:bg-white/90 outline-none transition-all placeholder-[#a0a09b] text-sm text-[#1a1a18]"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#4a4a46] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-[#a0a09b]" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-[#f0f0ee] border border-[#e0dfdb] rounded-lg focus:ring-2 focus:ring-[#1a1a18] focus:border-[#1a1a18] focus:bg-white/90 outline-none transition-all placeholder-[#a0a09b] text-sm text-[#1a1a18]"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#1a1a18] text-[#f0f0ee] font-medium rounded-lg hover:bg-black hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-[#8a8a84]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#1a1a18] font-bold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
