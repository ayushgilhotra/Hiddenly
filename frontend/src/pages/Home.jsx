import React from 'react';
import Navbar from '../components/Navbar';
import SpotCard from '../components/SpotCard';
import { motion } from 'framer-motion';
import { Search, MapPin, Coffee, TreePine, Utensils, Compass } from 'lucide-react';

/**
 * LEARNING NOTE:
 * The Home page is the landing page.
 * We use a "Hero" section to grab attention and "framer-motion" for staggered animations.
 */
const Home = () => {
    const categories = [
        { icon: <Coffee size={18} />, label: 'Cafe' },
        { icon: <TreePine size={18} />, label: 'Nature' },
        { icon: <Utensils size={18} />, label: 'Food' },
        { icon: <Compass size={18} />, label: 'Adventure' },
    ];

    return (
        <div className="pt-20">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                {/* Animated pins background would go here */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3],
                                x: Math.random() * 1000 - 500,
                                y: Math.random() * 600 - 300
                            }}
                            transition={{
                                duration: 5 + Math.random() * 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute"
                        >
                            <MapPin size={24} className="text-accent/40" />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-4xl"
                >
                    <span className="text-accent tracking-[0.3em] font-bold text-xs uppercase mb-4 block accent-glow">
                        Step into the Unknown
                    </span>
                    <h1 className="text-6xl md:text-8xl font-heading mb-6 tracking-tight leading-tight">
                        Discover What <br />
                        <span className="italic text-accent">Google Won't</span> Show You
                    </h1>

                    <div className="max-w-2xl mx-auto mt-12 group">
                        <div className="relative flex items-center bg-white/5 border border-white/10 backdrop-blur-xl p-2 rounded-full focus-within:border-accent/50 transition-all duration-500 shadow-2xl focus-within:shadow-accent/5">
                            <Search className="ml-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Find hidden spots near you..."
                                className="w-full bg-transparent px-4 py-3 outline-none text-lg"
                            />
                            <button className="bg-accent text-background px-8 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all">
                                Reveal
                            </button>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            {categories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    className="flex items-center gap-2 bg-white/5 hover:bg-accent/10 hover:border-accent/40 border border-white/5 px-4 py-2 rounded-full text-sm transition-all duration-300"
                                >
                                    {cat.icon}
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Trending Section Sample */}
            <section className="py-20 px-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-heading mb-2">Trending Whispers</h2>
                        <p className="text-white/50">Most sought-after secrets this week.</p>
                    </div>
                    <button className="text-accent underline underline-offset-8 decoration-accent/30 hover:decoration-accent transition-all text-sm tracking-widest uppercase font-bold">
                        See All Secrets
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Placeholder for real data */}
                    {[1, 2, 3].map(i => (
                        <SpotCard key={i} spot={{
                            id: i,
                            name: `The Whispering Library ${i}`,
                            category: 'Cafe',
                            address: 'M-Block, Connaught Place, New Delhi',
                            budgetMin: 200,
                            budgetMax: 500,
                            averageRating: 4.8,
                            imageUrls: [`https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=800`]
                        }} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
