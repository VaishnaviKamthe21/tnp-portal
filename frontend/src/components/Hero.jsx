import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { getCurrentUser } from '../services/auth';

const Hero = () => {
    const [user, setUser] = useState(null);
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');

    const categories = ['Software', 'Data Science', 'Core Engineering', 'Internships'];
    const locations = ['Pune', 'Mumbai', 'Remote', 'Bangalore'];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-slate-900/90 backdrop-blur-sm" />
            </div>

            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-white/90">500+ Students Placed Successfully</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    {isAdmin ? (
                        <>
                            Your Students are{' '}
                            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                Waiting
                            </span>
                            {' '}for their Dream Job
                        </>
                    ) : (
                        <>
                            Your Dream Job is{' '}
                            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                Waiting
                            </span>
                        </>
                    )}
                </h1>

                <p className="text-lg sm:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                    We connect final year students with verified placement opportunities from top companies across India.
                </p>

                {/* Search Bar - Hidden for Admins */}
                {!isAdmin && (
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl shadow-black/20 flex flex-col md:flex-row gap-2">
                            {/* Search Input */}
                            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search job title or company"
                                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Category Dropdown */}
                            <div className="relative">
                                <select
                                    className="w-full md:w-44 px-4 py-3 bg-gray-50 rounded-xl appearance-none outline-none text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Location Dropdown */}
                            <div className="relative">
                                <select
                                    className="w-full md:w-40 px-4 py-3 bg-gray-50 rounded-xl appearance-none outline-none text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    <option value="">Location</option>
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Search Button */}
                            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                                Search
                            </button>
                        </div>
                    </div>
                )}

                {/* Action Buttons - Conditional for Admin/Student */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {isAdmin ? (
                        <>
                            <Link
                                to="/admin/jobs"
                                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all transform hover:-translate-y-0.5"
                            >
                                Post a Job →
                            </Link>
                            <Link
                                to="/admin/dashboard"
                                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all transform hover:-translate-y-0.5"
                            >
                                Dashboard
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/student/jobs"
                                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all transform hover:-translate-y-0.5"
                            >
                                Find a Job →
                            </Link>
                            <Link
                                to="/student/recommendations"
                                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all transform hover:-translate-y-0.5"
                            >
                                Recommended Jobs for you
                            </Link>
                        </>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: '500+', label: 'Students Placed' },
                        { value: '100+', label: 'Partner Companies' },
                        { value: '95%', label: 'Success Rate' },
                        { value: '50+', label: 'Active Jobs' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-white/60">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
