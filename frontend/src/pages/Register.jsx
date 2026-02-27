import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, User, Mail, Lock, Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError('The register failed. The trail is blocked.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="journal-card w-full max-w-md p-8 bg-card shadow-2xl"
            >
                <div className="text-center mb-8">
                    <Compass className="text-accent mx-auto mb-4" size={40} />
                    <h1 className="text-3xl font-heading mb-2">Join the Guild</h1>
                    <p className="text-white/40 text-sm italic">Share secrets, find treasures.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-bold text-accent/80 ml-1">Explorer Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-accent/40 transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-bold text-accent/80 ml-1">Email Secret</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-accent/40 transition-all"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-bold text-accent/80 ml-1">Password Phrase</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-accent/40 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-background font-bold py-3 rounded-lg hover:border-accent shadow-glow transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Begin Journey'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-white/40">
                    Already a member? <Link to="/login" className="text-accent hover:underline">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
