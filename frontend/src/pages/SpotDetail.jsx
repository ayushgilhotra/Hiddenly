import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Star, MapPin, IndianRupee, Clock, User, MessageSquare, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * LEARNING NOTE:
 * SpotDetail page shows all info for a single place.
 * We use "useParams" to get the ID from the URL (/spots/:id).
 */
const SpotDetail = () => {
    const { id } = useParams();

    const { data: spot, isLoading } = useQuery({
        queryKey: ['spot', id],
        queryFn: async () => {
            const resp = await api.get(`/spots/${id}`);
            return resp.data;
        }
    });

    if (isLoading) return <div className="pt-40 text-center font-heading text-2xl">Unveiling the secret...</div>;
    if (!spot) return <div className="pt-40 text-center font-heading text-2xl">This secret has vanished.</div>;

    return (
        <div className="pb-20">
            <Navbar />

            {/* Hero Image */}
            <div className="relative h-[60vh] w-full">
                <img
                    src={spot.imageUrls?.[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1600'}
                    className="w-full h-full object-cover"
                    alt={spot.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-end gap-6"
                    >
                        <div>
                            <span className="bg-accent text-background px-3 py-1 rounded text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                                {spot.category}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-heading mb-4">{spot.name}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/70">
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} className="text-nature" />
                                    <span>{spot.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star size={18} className="text-accent fill-accent" />
                                    <span className="font-bold text-white">{spot.averageRating} Rating</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IndianRupee size={18} className="text-accent" />
                                    <span>{spot.budgetMin} - {spot.budgetMax}</span>
                                </div>
                            </div>
                        </div>

                        <button className="bg-white/5 border border-white/10 hover:border-accent/50 p-4 rounded-full transition-all group">
                            <Heart className="group-hover:text-red-500 group-hover:fill-red-500 transition-colors" />
                        </button>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Left: Info & Reviews */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h2 className="text-3xl font-heading mb-6 border-b border-white/5 pb-4">The Story</h2>
                        <p className="text-white/70 leading-relaxed text-lg italic">
                            {spot.description}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-heading mb-6">Visual Journal</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {spot.imageUrls?.map((url, i) => (
                                <img key={i} src={url} className="rounded-xl journal-card h-64 w-full object-cover" alt="journal entry" />
                            ))}
                            {(!spot.imageUrls || spot.imageUrls.length < 2) && (
                                <div className="bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center h-64">
                                    <p className="text-white/20 italic">More memories needed...</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-heading">Explorer Whispers</h2>
                            <button className="bg-accent/10 border border-accent/30 text-accent px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-accent hover:text-background transition-all">
                                Write a Review
                            </button>
                        </div>

                        {/* Simple Review Placeholder */}
                        <div className="space-y-6">
                            <div className="journal-card p-6 border-white/5 bg-white/2">
                                <div className="flex justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">A</div>
                                        <div>
                                            <p className="font-bold">Ananya S.</p>
                                            <p className="text-[10px] text-white/30 uppercase">Explorer • 2 days ago</p>
                                        </div>
                                    </div>
                                    <div className="flex text-accent">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-current" />)}
                                    </div>
                                </div>
                                <p className="text-white/60 italic">"Found this place by accident while roaming in CP. The coffee is divine and the peace is unmatched. A true hidden gem!"</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right: Map & Quick Info */}
                <div className="space-y-8">
                    <div className="journal-card p-6 space-y-6 sticky top-28">
                        <h3 className="font-heading text-2xl">Location Ritual</h3>
                        <div className="bg-white/5 aspect-square rounded-xl overflow-hidden border border-white/10 flex items-center justify-center relative">
                            {/* Small map placeholder */}
                            <MapPin size={48} className="text-accent opacity-20" />
                            <p className="absolute bottom-4 text-[10px] uppercase tracking-widest text-white/20">Secret Coordinates Lat/Lng</p>
                        </div>
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Clock size={18} className="text-nature" />
                                <span className="text-white/60">Open: 10:00 AM - 10:00 PM</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <User size={18} className="text-accent" />
                                <span className="text-white/60">Added by: {spot.addedBy?.name || 'Ancient Explorer'}</span>
                            </div>
                        </div>

                        <button className="w-full bg-accent text-background font-bold py-4 rounded-xl shadow-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                            <MapPin size={18} /> Get Directions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpotDetail;
