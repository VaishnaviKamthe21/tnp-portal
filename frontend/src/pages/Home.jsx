import Hero from '../components/Hero';
import FeatureCards from '../components/FeatureCards';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <main>
            <Hero />
            <FeatureCards />

            {/* CTA Section */}
            <section className="py-24 bg-[#1a1a18]">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Launch Your Career?</h2>
                    <p className="text-[#8a8a84] mb-10 max-w-lg mx-auto">
                        Join hundreds of students who have already found their dream jobs through CampusHire.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#f0f0ee] text-[#1a1a18] font-semibold rounded-lg hover:bg-white transition-colors text-sm"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/about"
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/[0.08] border border-white/[0.12] text-white/70 font-medium rounded-lg hover:bg-white/[0.14] transition-colors text-sm"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer strip */}
            <footer className="py-6 bg-[#111110] text-center">
                <p className="text-xs text-white/30 font-medium tracking-wide">
                    CampusHire — Training & Placement Portal
                </p>
            </footer>
        </main>
    );
};

export default Home;
