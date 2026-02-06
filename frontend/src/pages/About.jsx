import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
                    >
                        About Us
                    </motion.h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        Bridging the gap between academic excellence and professional success.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-lg text-gray-500"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
                        <p className="mb-6">
                            The Training and Placement Cell is an integral part of our institute. We are dedicated to providing a platform for students to gain valuable experience and for companies to find the best talent.
                        </p>
                        <p>
                            Our team works tirelessly to organize training sessions, workshops, and recruitment drives to ensure that our students are well-prepared for the corporate world.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative h-64 sm:h-72 md:h-96 rounded-2xl overflow-hidden shadow-xl"
                    >
                        <div className="absolute inset-0 bg-blue-600 opacity-20"></div>
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                            alt="Team working together"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500"
                    >
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
                        <p className="text-gray-500">
                            To empower students with necessary skills and opportunities to achieve their career goals and contribute to the society.
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-green-500"
                    >
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
                        <p className="text-gray-500">
                            To be a center of excellence in training and placement, bridging the gap between industry and academia.
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-purple-500"
                    >
                        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Our Values</h3>
                        <p className="text-gray-500">
                            Integrity, Excellence, Innovation, and Collaboration are the core values that guide our operations and interactions.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
