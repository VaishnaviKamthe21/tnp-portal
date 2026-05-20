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
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[#111110]/95 via-[#1a1a18]/92 to-[#111110]/95" />
            </div>

            {/* Subtle grain texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }} />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/[0.07] backdrop-blur-sm rounded-full border border-white/[0.08] mb-10">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[13px] text-white/70 font-medium tracking-wide">500+ Students Placed Successfully</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                    {isAdmin ? (
                        <>
                            Your Students are{' '}
                            <span className="text-[#a0a09b]">
                                Waiting
                            </span>
                            {' '}for their Dream Job
                        </>
                    ) : (
                        <>
                            Your Dream Job{' '}
                            <br className="hidden md:block" />
                            is{' '}
                            <span className="text-[#a0a09b]">
                                Waiting
                            </span>
                        </>
                    )}
                </h1>

                <p className="text-base sm:text-lg text-white/50 mb-14 max-w-xl mx-auto leading-relaxed font-normal">
                    We connect final year students with verified placement opportunities from top companies across India.
                </p>

                {/* Search Bar */}
                {!isAdmin && (
                    <div className="max-w-3xl mx-auto mb-14">
                        <div className="bg-[#f0f0ee] rounded-xl p-1.5 shadow-2xl shadow-black/40 flex flex-col md:flex-row gap-1.5">
                            {/* Search Input */}
                            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-lg">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search job title or company"
                                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Category Dropdown */}
                            <div className="relative">
                                <select
                                    className="w-full md:w-40 px-4 py-3 bg-white rounded-lg appearance-none outline-none text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors text-sm"
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
                                    className="w-full md:w-36 px-4 py-3 bg-white rounded-lg appearance-none outline-none text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors text-sm"
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
                            <button className="px-7 py-3 bg-[#1a1a18] text-white font-medium rounded-lg hover:bg-black transition-colors text-sm">
                                Search
                            </button>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {isAdmin ? (
                        <>
                            <Link
                                to="/admin/jobs"
                                className="px-8 py-3.5 bg-[#f0f0ee] text-[#1a1a18] font-semibold rounded-lg hover:bg-white transition-colors text-sm"
                            >
                                Post a Job
                            </Link>
                            <Link
                                to="/admin/dashboard"
                                className="px-8 py-3.5 bg-white/[0.08] border border-white/[0.12] text-white/80 font-medium rounded-lg hover:bg-white/[0.14] transition-colors text-sm"
                            >
                                Dashboard
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/student/jobs"
                                className="px-8 py-3.5 bg-[#f0f0ee] text-[#1a1a18] font-semibold rounded-lg hover:bg-white transition-colors text-sm"
                            >
                                Find a Job
                            </Link>
                            <Link
                                to="/student/recommendations"
                                className="px-8 py-3.5 bg-white/[0.08] border border-white/[0.12] text-white/80 font-medium rounded-lg hover:bg-white/[0.14] transition-colors text-sm"
                            >
                                Recommended Jobs for you
                            </Link>
                        </>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                    {[
                        { value: '500+', label: 'Students Placed' },
                        { value: '100+', label: 'Partner Companies' },
                        { value: '95%', label: 'Success Rate' },
                        { value: '50+', label: 'Active Jobs' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-white/90 mb-1">{stat.value}</div>
                            <div className="text-xs text-white/40 font-medium uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
