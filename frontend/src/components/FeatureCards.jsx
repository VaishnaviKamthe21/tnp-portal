import { Search, Briefcase, TrendingUp, Bot } from 'lucide-react';

const features = [
    {
        icon: Search,
        title: 'Search Verified Jobs',
        description: 'Students can browse placement-ready job postings from verified companies.',
        color: 'blue',
    },
    {
        icon: Briefcase,
        title: 'One Click Apply',
        description: 'Apply instantly with a single click using your pre-filled profile.',
        color: 'green',
    },
    {
        icon: TrendingUp,
        title: 'Placement Analytics',
        description: 'Admins track placement trends and statistics department-wise.',
        color: 'purple',
    },
    {
        icon: Bot,
        title: 'AI Career Assistant',
        description: 'Smart chatbot helps students prepare for interviews and assessments.',
        color: 'orange',
    },
];

const colorClasses = {
    blue: {
        bg: 'bg-blue-50',
        icon: 'bg-gradient-to-br from-blue-500 to-blue-600',
        shadow: 'shadow-blue-500/20',
        hover: 'group-hover:shadow-blue-500/30',
    },
    green: {
        bg: 'bg-green-50',
        icon: 'bg-gradient-to-br from-green-500 to-emerald-600',
        shadow: 'shadow-green-500/20',
        hover: 'group-hover:shadow-green-500/30',
    },
    purple: {
        bg: 'bg-purple-50',
        icon: 'bg-gradient-to-br from-purple-500 to-violet-600',
        shadow: 'shadow-purple-500/20',
        hover: 'group-hover:shadow-purple-500/30',
    },
    orange: {
        bg: 'bg-orange-50',
        icon: 'bg-gradient-to-br from-orange-500 to-amber-600',
        shadow: 'shadow-orange-500/20',
        hover: 'group-hover:shadow-orange-500/30',
    },
};

const FeatureCards = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-full mb-4">
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Everything You Need for{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            Successful Placements
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Our platform provides comprehensive tools for students and recruiters to connect seamlessly.
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const colors = colorClasses[feature.color];

                        return (
                            <div
                                key={index}
                                className={`group relative p-6 bg-white rounded-2xl border border-gray-100 shadow-lg ${colors.shadow} hover:shadow-xl ${colors.hover} transition-all duration-300 hover:-translate-y-1`}
                            >
                                {/* Icon */}
                                <div className={`w-14 h-14 ${colors.icon} rounded-xl flex items-center justify-center mb-5 shadow-lg transition-transform group-hover:scale-110`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Decorative gradient */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.icon} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeatureCards;
