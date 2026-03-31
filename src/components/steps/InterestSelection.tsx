import React from 'react';
import { StepProps } from '../../types';
import { motion } from 'framer-motion';
import { Target, Check, ChevronRight, ArrowLeft, Heart, Sparkles } from 'lucide-react';

const INTERESTS: Record<string, string[]> = {
    'Science': ['Space Exploration', 'Nanotechnology', 'Robotics', 'Genetic Engineering', 'Environmental Science', 'Data Science', 'Forensic Science', 'Quantum Physics'],
    'Commerce': ['Stock Market', 'Business Strategy', 'Digital Marketing', 'Fintech', 'Legal Compliance', 'Auditing', 'Supply Chain', 'Financial Modeling'],
    'Arts / Humanities': ['UI/UX Design', 'Film Production', 'Journalism', 'Counseling', 'Global Politics', 'Museum Curation', 'Photography', 'Heritage Conserv.']
};

export const InterestSelection: React.FC<StepProps> = ({ userData, updateUserData, onNext, onBack }) => {
    const list = INTERESTS[userData.stream] || INTERESTS['Science'];
    const [customInterest, setCustomInterest] = React.useState('');

    const handleCustomInterestChange = (val: string) => {
        setCustomInterest(val);
        updateUserData({ interests: { primary: val } });
    };

    const setPredefinedInterest = (interest: string) => {
        setCustomInterest(''); // Clear custom when choosing predefined
        updateUserData({ interests: { primary: interest } });
    };

    return (
        <div className="w-full max-w-2xl mx-auto py-6 md:py-10 px-0 md:px-4">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="corporate-card overflow-hidden shadow-2xl !rounded-3xl md:!rounded-[2.5rem]"
            >
                <div className="p-6 md:p-8 bg-indigo-600 dark:bg-indigo-700 text-white flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Heart size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold">Interests Analysis</h2>
                        <p className="text-indigo-100 text-xs md:text-sm">Choose your direction</p>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-8 md:space-y-10">
                    <div className="space-y-6">
                        <label className="label-text flex items-center gap-2 text-indigo-600">
                            <Sparkles size={16} />
                            Primary Drive
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            {list.map(interest => (
                                <button
                                    key={interest}
                                    onClick={() => setPredefinedInterest(interest)}
                                    className={`p-4 md:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between group h-24 md:h-28 text-left ${userData.interests.primary === interest && !customInterest
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400'
                                            : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-200 bg-white dark:bg-slate-900'
                                        }`}
                                >
                                    <h3 className="font-bold flex items-center justify-between w-full text-xs md:text-sm">
                                        {interest}
                                        {userData.interests.primary === interest && !customInterest && <Check size={16} />}
                                    </h3>
                                    <p className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Expert Advice</p>
                                </button>
                            ))}
                        </div>

                        {/* Custom Interest Input */}
                        <div className="pt-6 md:pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <label className="label-text flex items-center gap-2">
                                <Target size={16} className="text-indigo-600" />
                                Other Specific Interest
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={customInterest}
                                    onChange={(e) => handleCustomInterestChange(e.target.value)}
                                    placeholder="E.g. Marine Biology..."
                                    className={`input-field pr-12 transition-all text-sm md:text-base py-3 md:py-4 ${customInterest
                                            ? 'border-indigo-600 ring-2 ring-indigo-50 dark:ring-indigo-900/20'
                                            : ''
                                        }`}
                                />
                                {customInterest && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-600">
                                        <Check size={18} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-6 md:pt-10">
                        <button
                            onClick={onBack}
                            className="w-full sm:flex-1 px-6 py-3 md:py-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold transition-all flex items-center justify-center gap-2 min-h-[44px]"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>
                        <button
                            onClick={onNext}
                            disabled={!userData.interests.primary}
                            className="w-full sm:flex-[2] btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition-all min-h-[50px] md:min-h-[60px]"
                        >
                            Analyze
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
