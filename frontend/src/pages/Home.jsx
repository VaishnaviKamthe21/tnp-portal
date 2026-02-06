import Hero from '../components/Hero';
import FeatureCards from '../components/FeatureCards';

const Home = () => {
    return (
        <main>
            <Hero />
            <FeatureCards />
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Launch Your Career?</h2>
                    <p className="text-gray-600 mb-8">Join hundreds of students who have already found their dream jobs through CampusHire.</p>
                </div>
            </section>
        </main>
    );
};

export default Home;
