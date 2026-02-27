import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Image as ImageIcon, Info, Check, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

/**
 * LEARNING NOTE:
 * Multi-step form for adding a spot.
 * We track "step" in state and conditionally render segments.
 * This improves UX for complex forms.
 */
const AddSpot = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Cafe',
        budgetMin: '',
        budgetMax: '',
        latitude: 28.6139,
        longitude: 77.2090,
        address: '',
        imageUrls: []
    });

    const navigate = useNavigate();

    const handleNext = () => setStep(s => s + 1);
    const handlePrev = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // In a real app, you'd upload images to Cloudinary here first
            // For now, we'll send dummy image URLs
            const dataToSubmit = {
                ...formData,
                imageUrls: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800"]
            };
            await api.post('/spots', dataToSubmit);
            navigate('/explore');
        } catch (err) {
            alert("Failed to share secret. The keeper rejected it.");
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: 'Basics', icon: <Info size={16} /> },
        { id: 2, title: 'Location', icon: <MapPin size={16} /> },
        { id: 3, title: 'Atmosphere', icon: <ImageIcon size={16} /> },
        { id: 4, title: 'Ritual', icon: <Check size={16} /> }
    ];

    return (
        <div className="pt-32 pb-20 px-4 max-w-2xl mx-auto">
            <Navbar />

            {/* Progress Indicator */}
            <div className="flex justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -z-10" />
                {steps.map((s) => (
                    <div
                        key={s.id}
                        className={`flex flex-col items-center gap-2 ${step >= s.id ? 'text-accent' : 'text-white/20'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 ${step >= s.id ? 'border-accent bg-accent/10 shadow-glow' : 'border-white/10 bg-background'}`}>
                            {step > s.id ? <Check size={16} /> : s.icon}
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold">{s.title}</span>
                    </div>
                ))}
            </div>

            <div className="journal-card p-8 min-h-[400px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-heading mb-6">Step 1: The Essence</h2>
                            <div className="space-y-4">
                                <input
                                    placeholder="Secret Spot Name"
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-accent/40"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                                <textarea
                                    placeholder="Tell the story of this place..."
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-accent/40"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                                <select
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-accent/40 appearance-none"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option className="bg-background">Cafe</option>
                                    <option className="bg-background">Nature</option>
                                    <option className="bg-background">Budget Food</option>
                                    <option className="bg-background">Secret Place</option>
                                </select>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-heading mb-6">Step 2: Coordinates</h2>
                            <input
                                placeholder="Exact Address"
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-accent/40"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                            <div className="h-48 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                                <MapPin className="text-accent opacity-20" size={40} />
                                <p className="absolute bottom-4 text-[10px] uppercase tracking-widest text-white/20">Map Pin Ritual Area</p>
                            </div>
                            <p className="text-xs text-white/40 italic">Check the stars, drop the pin exactly where it hides.</p>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-heading mb-6">Step 3: Treasury</h2>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-[10px] uppercase tracking-widest text-accent mb-2 block">Min Budget</label>
                                    <input type="number" placeholder="200" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-accent/40" value={formData.budgetMin} onChange={e => setFormData({ ...formData, budgetMin: e.target.value })} />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] uppercase tracking-widest text-accent mb-2 block">Max Budget</label>
                                    <input type="number" placeholder="500" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-accent/40" value={formData.budgetMax} onChange={e => setFormData({ ...formData, budgetMax: e.target.value })} />
                                </div>
                            </div>
                            <div className="h-40 bg-white/2 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent/40 transition-colors">
                                <ImageIcon className="text-white/20 mb-2" />
                                <span className="text-sm text-white/30">Capture the magic (Upload Photos)</span>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                                <Compass className="text-accent" size={32} />
                            </div>
                            <h2 className="text-4xl font-heading mb-4">The Final Vow</h2>
                            <p className="text-white/50 italic mb-8">
                                Is your secret accurate? <br />
                                Once shared, the world may find its way there.
                            </p>
                            <div className="bg-white/5 p-4 rounded-xl text-left text-sm space-y-2 border border-white/5">
                                <p><span className="text-accent uppercase text-[10px] font-bold">Spot:</span> {formData.name}</p>
                                <p><span className="text-accent uppercase text-[10px] font-bold">Category:</span> {formData.category}</p>
                                <p><span className="text-accent uppercase text-[10px] font-bold">Address:</span> {formData.address}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-4 mt-12">
                    {step > 1 && (
                        <button
                            onClick={handlePrev}
                            className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                        >
                            <ArrowLeft size={18} /> Back
                        </button>
                    )}
                    <button
                        onClick={step === 4 ? handleSubmit : handleNext}
                        disabled={loading}
                        className="flex-[2] bg-accent text-background py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-glow hover:scale-[1.02] transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                {step === 4 ? 'Seal & Share' : 'Continue'}
                                {step < 4 && <ArrowRight size={18} />}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSpot;
