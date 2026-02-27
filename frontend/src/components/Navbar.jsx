import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Search, PlusCircle, User, LogOut } from 'lucide-react';

/**
 * LEARNING NOTE:
 * Navbar uses a "glassmorphism" effect (see glass-nav in index.css).
 * We conditionally render links based on whether the user is logged in.
 */
const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="glass-nav px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
                <Compass className="text-accent group-hover:rotate-45 transition-transform duration-500" size={28} />
                <span className="font-heading text-2xl tracking-wide">Hiddenly</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase">
                <Link to="/explore" className="hover:text-accent transition-colors flex items-center gap-1">
                    <Search size={16} /> Explore
                </Link>
                {user ? (
                    <>
                        <Link to="/add-spot" className="hover:text-accent transition-colors flex items-center gap-1">
                            <PlusCircle size={16} /> Share Spot
                        </Link>
                        <Link to="/profile" className="hover:text-accent transition-colors flex items-center gap-1">
                            <User size={16} /> Profile
                        </Link>
                        <button
                            onClick={logout}
                            className="hover:text-accent transition-colors flex items-center gap-1"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="bg-accent text-background px-5 py-2 rounded-full font-bold hover:bg-accent/80 transition-colors">
                        Embark
                    </Link>
                )}
            </div>

            {/* Mobile nav could go here */}
        </nav>
    );
};

export default Navbar;
