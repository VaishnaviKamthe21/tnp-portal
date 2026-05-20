import { Search, Briefcase, TrendingUp, Bot } from 'lucide-react';

const features = [
    {
        icon: Search,
        title: 'Search Verified Jobs',
        description: 'Students can browse placement-ready job postings from verified companies.',
    },
    {
        icon: Briefcase,
        title: 'One Click Apply',
        description: 'Apply instantly with a single click using your pre-filled profile.',
    },
    {
        icon: TrendingUp,
        title: 'Placement Analytics',
        description: 'Admins track placement trends and statistics department-wise.',
    },
    {
        icon: Bot,
        title: 'AI Career Assistant',
        description: 'Smart chatbot helps students prepare for interviews and assessments.',
    },
];

const FeatureCards = () => {
    return (
        <section className="py-24 bg-[#f0f0ee]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-[#e6e5e1] text-[#6b6b66] text-xs font-semibold rounded-full mb-5 uppercase tracking-widest">
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a18] mb-4">
                        Everything You Need for
                        <br className="hidden sm:block" />
                        Successful Placements
                    </h2>
                    <p className="text-base text-[#8a8a84] max-w-lg mx-auto">
                        Our platform provides comprehensive tools for students and recruiters to connect seamlessly.
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={index}
                                className="group relative p-7 bg-white/70 rounded-2xl border border-[#e0dfdb] hover:bg-white hover:border-[#d0cfcb] hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300"
                            >
                                {/* Icon */}
                                <div className="w-11 h-11 bg-[#1a1a18] rounded-xl flex items-center justify-center mb-5">
                                    <Icon className="w-5 h-5 text-[#f0f0ee]" />
                                </div>

                                {/* Content */}
                                <h3 className="text-base font-bold text-[#1a1a18] mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-[#8a8a84] leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeatureCards;
