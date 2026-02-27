import React from 'react';
import Navbar from '../components/Navbar';
import SpotCard from '../components/SpotCard';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { User, Settings, MapPin, Heart, Plus } from 'lucide-react';

/**
 * LEARNING NOTE:
 * Profile page shows personalized user data.
 * We fetch the user's added spots and wishlist using React Query.
 */
const Profile = () => {
    const { user } = useAuth();

    const { data: mySpots } = useQuery({
        queryKey: ['my-spots'],
        queryFn: async () => {
            const resp = await api.get('/spots'); // In real app, filter by user on backend
            return resp.data.filter(s => s.addedBy?.email === user?.email);
        },
        enabled: !!user
    });

    const { data: wishlist } = useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const resp = await api.get('/wishlist');
            return resp.data;
        },
        enabled: !!user
    });

    return (
        <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
            <Navbar />

            {/* Profile Header */}
            <div className="journal-card p-12 mb-16 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-accent/20 border-2 border-accent/50 flex items-center justify-center text-5xl font-heading text-accent shadow-glow">
                        {user?.name?.[0] || 'E'}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-accent text-background p-2 rounded-full border-4 border-[#0f0e0d]">
                        <Settings size={16} />
                    </button>
                </div>

                <div className="text-center md:text-left flex-1">
                    <h1 className="text-4xl font-heading mb-2">{user?.name || 'Explorer'}</h1>
                    <p className="text-white/40 italic mb-4 max-w-lg">
                        "Seeker of silent forests and loud cafes. Chronicling the world's most beautiful hideouts."
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                            <MapPin size={12} className="text-nature" /> {mySpots?.length || 0} Secrets Shared
                        </span>
                        <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                            <Heart size={12} className="text-red-400" /> {wishlist?.length || 0} Saved Whispers
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs / Grids */}
            <div className="space-y-20">
                <section>
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-heading">My Journal Entries</h2>
                        <button className="text-accent flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:translate-x-1 transition-transform">
                            <Plus size={18} /> New Discovery
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mySpots?.map(spot => (
                            <SpotCard key={spot.id} spot={spot} />
                        ))}
                        {mySpots?.length === 0 && (
                            <div className="col-span-full py-20 bg-white/2 rounded-3xl border border-dashed border-white/10 text-center">
                                <p className="text-white/20 italic">The journal is empty. Start your journey.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-heading mb-10">Wishlist</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlist?.map(spot => (
                            <SpotCard key={spot.id} spot={spot} />
                        ))}
                        {wishlist?.length === 0 && (
                            <div className="col-span-full py-20 bg-white/2 rounded-3xl border border-dashed border-white/10 text-center">
                                <p className="text-white/20 italic">No whispers saved yet.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;
