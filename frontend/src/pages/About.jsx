import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold text-[#1a1a18] sm:text-5xl tracking-tight"
                    >
                        About Us
                    </motion.h1>
                    <p className="mt-4 max-w-xl mx-auto text-lg text-[#8a8a84]">
                        Bridging the gap between academic excellence and professional success.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-[#1a1a18] mb-6">Who We Are</h2>
                        <p className="text-[#6b6b66] mb-6 leading-relaxed">
                            The Training and Placement Cell is an integral part of our institute. We are dedicated to providing a platform for students to gain valuable experience and for companies to find the best talent.
                        </p>
                        <p className="text-[#6b6b66] leading-relaxed">
                            Our team works tirelessly to organize training sessions, workshops, and recruitment drives to ensure that our students are well-prepared for the corporate world.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative h-64 sm:h-72 md:h-96 rounded-2xl overflow-hidden border border-[#e0dfdb] shadow-sm"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                            alt="Team working together"
                            className="w-full h-full object-cover grayscale-[20%]"
                        />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white/70 p-8 rounded-2xl border border-[#e0dfdb] hover:border-[#d0cfcb] hover:shadow-lg hover:shadow-black/[0.04] transition-all"
                    >
                        <div className="h-11 w-11 bg-[#1a1a18] rounded-xl flex items-center justify-center mb-6">
                            <svg className="h-5 w-5 text-[#f0f0ee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-[#1a1a18] mb-3">Our Mission</h3>
                        <p className="text-[#8a8a84] text-sm leading-relaxed">
                            To empower students with necessary skills and opportunities to achieve their career goals and contribute to the society.
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white/70 p-8 rounded-2xl border border-[#e0dfdb] hover:border-[#d0cfcb] hover:shadow-lg hover:shadow-black/[0.04] transition-all"
                    >
                        <div className="h-11 w-11 bg-[#1a1a18] rounded-xl flex items-center justify-center mb-6">
                            <svg className="h-5 w-5 text-[#f0f0ee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-[#1a1a18] mb-3">Our Vision</h3>
                        <p className="text-[#8a8a84] text-sm leading-relaxed">
                            To be a center of excellence in training and placement, bridging the gap between industry and academia.
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white/70 p-8 rounded-2xl border border-[#e0dfdb] hover:border-[#d0cfcb] hover:shadow-lg hover:shadow-black/[0.04] transition-all"
                    >
                        <div className="h-11 w-11 bg-[#1a1a18] rounded-xl flex items-center justify-center mb-6">
                            <svg className="h-5 w-5 text-[#f0f0ee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-[#1a1a18] mb-3">Our Values</h3>
                        <p className="text-[#8a8a84] text-sm leading-relaxed">
                            Integrity, Excellence, Innovation, and Collaboration are the core values that guide our operations and interactions.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
