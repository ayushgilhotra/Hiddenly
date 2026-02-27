import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SpotCard from '../components/SpotCard';
import { Search, Filter, Map as MapIcon, SlidersHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

/**
 * LEARNING NOTE:
 * Explore page uses a split layout.
 * Left: Scrollable sidebar for spots.
 * Right: Full-screen map (using a placeholder for now).
 * We use React Query (useQuery) for efficient data fetching and caching.
 */
const Explore = () => {
    const [search, setSearch] = useState('');

    const { data: spots, isLoading } = useQuery({
        queryKey: ['spots', search],
        queryFn: async () => {
            const resp = await api.get(`/spots${search ? `?search=${search}` : ''}`);
            return resp.data;
        }
    });

    return (
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 flex overflow-hidden pt-20">
                {/* Sidebar - Spots List */}
                <div className="w-full lg:w-1/3 xl:w-1/4 h-full bg-[#0f0e0d] border-r border-white/5 overflow-y-auto custom-scrollbar">
                    <div className="p-6 space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="text"
                                placeholder="Search hidden gems..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-accent/40"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <h2 className="text-accent tracking-widest uppercase text-xs font-bold">Discoveries</h2>
                            <button className="text-white/40 hover:text-white transition-colors">
                                <SlidersHorizontal size={18} />
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-64 bg-white/5 animate-pulse rounded-xl" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {spots?.map(spot => (
                                    <SpotCard key={spot.id} spot={spot} />
                                ))}
                                {spots?.length === 0 && (
                                    <div className="text-center py-20">
                                        <p className="text-white/30 italic">No secrets found here.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Section */}
                <div className="hidden lg:block flex-1 bg-[#1a1918] relative">
                    {/* Placeholder for Google Maps */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <MapIcon size={64} className="text-white/5 mx-auto" />
                            <p className="text-white/20 font-heading text-2xl">Dark Map Realm</p>
                            <p className="text-xs text-white/10 uppercase tracking-[0.3em]">Map integration pending API key</p>
                        </div>
                    </div>

                    {/* Map Overlay Toggle */}
                    <div className="absolute bottom-10 left-10 journal-card p-3 flex items-center gap-4 text-xs font-bold uppercase tracking-widest border-accent/20">
                        <button className="bg-accent text-background px-4 py-2 rounded-lg">List</button>
                        <button className="text-white/40 px-4 py-2">Map View</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explore;
