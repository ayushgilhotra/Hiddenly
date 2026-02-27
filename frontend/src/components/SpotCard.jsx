import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * LEARNING NOTE:
 * This component displays a single hidden spot.
 * We use framer-motion for the reveal animation on scroll.
 */
const SpotCard = ({ spot }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="journal-card group"
        >
            <Link to={`/spots/${spot.id}`}>
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={spot.imageUrls?.[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800'}
                        alt={spot.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold border border-white/10 flex items-center gap-1">
                        <Star size={12} className="text-accent fill-accent" />
                        {spot.averageRating || 'New'}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-accent/80 font-bold">
                            {spot.category}
                        </span>
                        <h3 className="text-lg font-heading group-hover:text-accent transition-colors truncate">
                            {spot.name}
                        </h3>
                    </div>
                </div>

                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-1 text-white/60 text-xs">
                        <MapPin size={12} className="text-nature" />
                        <span className="truncate">{spot.address}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center text-accent/90">
                            <IndianRupee size={12} />
                            <span>{spot.budgetMin} - {spot.budgetMax}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default SpotCard;
